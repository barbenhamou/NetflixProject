#include "../Include/SocketMenu.h"

SocketMenu::SocketMenu(int clientSocket) : clientSocket(clientSocket) {}

std::vector<std::string> SocketMenu::nextCommand() {
    try {
        std::string input;
        char buffer[1024];
        ssize_t bytes_recved;

        // Read until a newline is encountered
        while ((bytes_recved = recv(this->clientSocket, buffer, sizeof(buffer) - 1, 0)) > 0) {
            // Null-terminate the received data, makes concatenation to input availabe
            buffer[bytes_recved] = '\0';
            input += buffer;

            // Check if we received the newline delimiter - end of request
            if (input.find('\n') != std::string::npos) {
                break;
            }
        }

        // If no data received or an error occurred
        if (bytes_recved <= 0) {
            close(this->clientSocket);
            return {};
        }

        // Parse the command
        std::istringstream ss(input);
        std::string command;
        ss >> command;

        // Return the command and its arguments
        return {command, input.substr(command.size())};
    } catch (...) {
        close(this->clientSocket);  // Ensure socket closure on error
        return {};
    }
}

void SocketMenu::sendOutput(std::string output) {
    try {
        // Send the output message
        ssize_t bytes_sent = send(this->clientSocket, output.c_str(), output.size(), 0);

        // An error occurred
        if (bytes_sent == -1) {
            close(this->clientSocket);
        }
    } catch (...) {
        close(this->clientSocket);
    }
}
