#pragma once

#include <thread>
#include <vector>

#include "ClientHandler.h"

// Thread manager for the multi-threaded
class IThreadManager {
    public:
        // Adding tasks for execution
        virtual void addTask(int clientSocket) = 0;

        // Finishing job
        virtual void shutdown() = 0;

        // Destructor / Destroyer
        virtual ~IThreadManager() = default;
};