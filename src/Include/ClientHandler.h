#pragma once

#include "App.h"
#include "SocketMenu.h"
#include "Globals.h"

// A wrapper for the interaction with the client
class ClientHandler {
    private:
        int clientSocket;
        IMenu* menu;
        App* app;

    public:
        // Constructor
        ClientHandler(int clientSocket);

        // Initiates the interaction with the client, in thread
        void interact();
};