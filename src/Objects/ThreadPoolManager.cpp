#include "../Include/ThreadPoolManager.h"

ThreadPoolManager::ThreadPoolManager(unsigned long int clientCount) : stop(false) {
    for (unsigned long int i = 0; i < clientCount; i++) {
        this->workers.emplace_back(&ThreadPoolManager::genericFunction, this);
    }
}

void ThreadPoolManager::shutdown() {
    {
        std::lock_guard<std::mutex> lock(this->queueMutex);
        this->stop = true;
    }
    this->condition.notify_all(); // Wake up all workers

    for (std::thread &worker : this->workers) {
        if (worker.joinable()) {
            worker.join(); // Wait for each worker to finish
        }
    }
}

void ThreadPoolManager::addTask(int clientSocket) {
    {
        std::lock_guard<std::mutex> lock(this->queueMutex);
        this->clientSocketQueue.push(clientSocket); // Add task to the queue
    }
    this->condition.notify_one(); // Notify a worker thread
}

void ThreadPoolManager::genericFunction() {
    int clientSocket;
    while(true) {
        { // Created a new block so the lock will be automatically released.
            std::unique_lock<std::mutex> lock(this->queueMutex);
            this->condition.wait(lock, [this] { return this->stop || !this->clientSocketQueue.empty(); });

            if (this->stop && this->clientSocketQueue.empty()) {
                return;
            }

            clientSocket = this->clientSocketQueue.front();
            this->clientSocketQueue.pop();
        }

        ClientHandler handler(clientSocket);
        handler.interact();
    }
}