#pragma once

#include <iostream>
#include <thread>
#include <vector>
#include <cstring>

#include "IServer.h"

// A TCP protocol server
class TCPServer : public IServer {
    private:
        uint32_t port;
        int serverSocket;
        IThreadManager* threadManager;
        bool active;

    public:
        // Constructor
        TCPServer(uint32_t port, IThreadManager* manager);

        // Destructor / Destoyer
        ~TCPServer() {this->shutdown();}
        
        int activate() override;

        void  shutdown() override;

        // Getter for the socket
        ssize_t getSocket() {
            return this->serverSocket;
        }
};