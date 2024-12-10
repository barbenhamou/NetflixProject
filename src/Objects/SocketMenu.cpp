#include "../Include/SocketMenu.h"

SocketMenu::SocketMenu(int clientSocket) : clientSocket(clientSocket) {}

std::vector<std::string> SocketMenu::nextCommand() {
    char input[4096] = { 0 };

    int bytes_recved = recv(this->clientSocket, input, sizeof(input) - 1, 0);

    if (bytes_received <= 0) {
        close(clientSocket);
        return {};
    }

    // Initialize a stream
    std::istringstream ss(input);

    // Get the first word
    ss >> command;

    // return the command and its arguments
    return {command, input.substr(command.size())};
}

void SocketMenu::displayError(std::string error) {
    send(this->clientSocket, error.c_str(), error.size(), 0);
}
