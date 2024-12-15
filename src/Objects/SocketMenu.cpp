#include "../Include/SocketMenu.h"

SocketMenu::SocketMenu(int clientSocket) : clientSocket(clientSocket) {}

std::vector<std::string> SocketMenu::nextCommand() {
    try {
        // Receive the size of the incoming data first
        uint32_t size = 0;
        int bytes_recved = recv(this->clientSocket, &size, sizeof(size), 0);

        if (bytes_recved != sizeof(size) || size <= 0) {
            close(clientSocket);  // Close the socket on error
            return {};
        }

        size = ntohl(size);  // Convert size from network byte order to host byte order

        // Buffer to receive the data
        std::vector<char> buffer(size + 1, '\0'); // +1 for null terminator
        bytes_recved = recv(this->clientSocket, buffer.data(), size, 0);

        if (bytes_recved != size) {  // handle exception if not all bytes are received
            close(clientSocket);
            return {};
        }

        std::string data(buffer.data());  // Convert received data to a string

        // Parse the command
        std::istringstream ss(data);
        std::string command;
        ss >> command;

        // Return the command and its arguments
        return {command, data.substr(command.size())};
    } catch (...) {
        close(clientSocket);  // Ensure socket closure on error
        return {};
    }
}

void SocketMenu::sendOutput(std::string output) {
    try {
        // Send the size of the output first
        uint32_t size = htonl(output.size());
        send(this->clientSocket, &size, sizeof(size), 0);

        // Send the actual output
        send(this->clientSocket, output.c_str(), output.size(), 0);
    } catch (...) {}
}
