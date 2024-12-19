#pragma once

#include "IThreadManager.h"

// Thread handling where one client per thread
class ThreadClientManager : public IThreadManager {
    private:
        std::vector<std::thread> workers;

    public:
        ~ThreadClientManager() {
            this->shutdown();
        }

        void addTask(int clientSocket) override;

        void shutdown() override;
};

