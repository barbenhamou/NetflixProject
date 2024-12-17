#pragma once

#include <iostream>
#include <thread>
#include <vector>
#include <cstring>
#include <arpa/inet.h>
#include <unistd.h>

#include "ClientHandler.h"

class TCPServer {
    private:
        std::string ip;
        uint32_t port;
        ssize_t serverSocket;
        std::vector<std::thread> threads;
        bool active;

    public:
        // Constructor
        TCPServer(std::string ip, uint32_t port);

        // Activating the server
        int activate();

        // The shutdown routine of the server
        void  shutdown();

        // Getter for the socket
        ssize_t getSocket() {
            return this->serverSocket;
        }

        // Destructor-Destoyer
        ~TCPServer() {this->shutdown();}
    
};