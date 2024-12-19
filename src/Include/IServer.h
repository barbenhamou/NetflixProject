#pragma once

#include <arpa/inet.h>
#include <unistd.h>

#include "ClientHandler.h"
#include "ThreadClientManager.h"

// An interface that all kinds of server will have to satisfy
class IServer {
    public:
        virtual ~IServer() = default;

        // Actives the server
        virtual int activate() = 0;

        // The shutdown routine of the server
        virtual void shutdown() = 0;
};