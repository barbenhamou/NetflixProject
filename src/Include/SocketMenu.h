#pragma once

#include "IMenu.h"

// A menu in the that sends and accepts data from socket
class SocketMenu : public IMenu {
    private:
        int clientSocket;

    public:
        // Constructor
        SocketMenu(int clientSocket);

        // Destructor
        ~SocketMenu() {
            close(this->clientSocket);
        }

        std::vector<std::string> nextCommand() override;

        void sendOutput(std::string output) override;
};