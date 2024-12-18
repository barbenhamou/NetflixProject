#pragma once

#include <iostream>
#include <thread>
#include <vector>
#include <cstring>

#include "IServer.h"

// TCP server
class TCPServer : public IServer {
    private:
        std::string ip;
        uint32_t port;
        int serverSocket;
        IThreadManager* threadManager;
        bool active;

    public:
        // Constructor
        TCPServer(std::string ip, uint32_t port, IThreadManager* manager);

        // Activating the server
        int activate();

        // The shutdown routine of the server
        void  shutdown();

        // Getter for the socket
        ssize_t getSocket() {
            return this->serverSocket;
        }

        // Destructor / Destoyer
        ~TCPServer() {this->shutdown();}
    
};