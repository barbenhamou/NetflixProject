#pragma once

#include "IThreadManager.h"

// Thread handling where one client per thread
class ThreadPoolMessage : public IThreadManager {
    private:
        std::vector<std::thread> workers;

    public:
        ~ThreadPoolMessage() {
            this->shutdown();
        }

        void addTask(int clientSocket) override;

        void shutdown() override;
};

