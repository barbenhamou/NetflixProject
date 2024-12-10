#pragma once

#include "IMenu.h"

// A menu in the that sends and accepts data from socket
class SocketMenu : public IMenu {
    private:
        int clientSocket;

    public:
        // Constructor
        SocketMenu(int clientSocket);

        int nextCommand() override;

        void displayError(std::string error) override;

        // Destructor
        ~SocketMenu() {
            close(this->clientSocket);
        }
}