#pragma once

#include <arpa/inet.h>
#include <unistd.h>

#include "ClientHandler.h"
#include "ThreadClientManager.h"

// An interface for servers that run the app
class IServer {
    public:
        virtual ~IServer() = default;

        // Actives the server
        virtual int activate() = 0;

        // The shutdown routine of the server
        virtual void shutdown() = 0;
};