#pragma once

#include <vector>
#include <thread>
#include <queue>
#include <functional>
#include <mutex>
#include <condition_variable>
#include <atomic>
#include "IThreadManager.h"

// ThreadPool thread manager
class ThreadPoolManager : public IThreadManager {
    private:
        std::vector<std::thread> workers;
        std::queue<int> clientSocketQueue;
        std::mutex queueMutex;
        std::condition_variable condition;
        std::atomic<bool> stop;

    public:
        ThreadPoolManager(unsigned long int poolSize);

        void addTask(int clientSocket) override;
        
        void shutdown() override;
        
        // Function of the thread
        void genericFunction();
};
