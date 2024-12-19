#pragma once

#include "IThreadManager.h"

// Thread handling where one client per thread
class ThreadClientManager : public IThreadManager {
    private:
        std::vector<std::thread> workers;

    public:
        // Destoyer / Destructor
        ~ThreadClientManager() {
            this->shutdown();
        }

        // Creating a new thread
        void addTask(int clientSocket) override;

        // Shutting down the manager
        void shutdown() override;
};

