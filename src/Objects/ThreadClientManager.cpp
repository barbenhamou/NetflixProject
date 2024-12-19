#include "../Include/ThreadClientManager.h"

void ThreadClientManager::addTask(int clientSocket) {
    this->workers.emplace_back([clientSocket]() {
        ClientHandler handler(clientSocket);
        handler.interact();
    });
}

void ThreadClientManager::shutdown() {
    for (auto& worker : this->workers) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}
