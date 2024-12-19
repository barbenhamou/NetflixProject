#pragma once

#include <thread>
#include <vector>

#include "ClientHandler.h"

// Thread manager for the multi-threaded
class IThreadManager {
    public:
        // Destructor / Destroyer
        virtual ~IThreadManager() = default;

        // Adds tasks for execution
        virtual void addTask(int clientSocket) = 0;

        // Finishes the job
        virtual void shutdown() = 0;
};