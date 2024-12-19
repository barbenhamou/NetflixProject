#include "../Include/TCPServer.h"

TCPServer::TCPServer(std::string ip, uint32_t port, IThreadManager* manager)
    : ip(std::move(ip)), port(port), threadManager(manager), active(false) {
    this->serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (this->serverSocket < 0) {
        this->serverSocket = -1;
    }
}

int TCPServer::activate() {
    if (this->serverSocket == -1) {
        return -1;
    }

    sockaddr_in serverAddress{};
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_addr.s_addr = inet_addr(this->ip.c_str());
    serverAddress.sin_port = htons(port);

    if (bind(this->serverSocket, (struct sockaddr*)&serverAddress, sizeof(serverAddress)) < 0) {
        return -1;
    }

    if (listen(this->serverSocket, 128) < 0) {
        return -1;
    }

    this->active = true;

    while (this->active) {
        sockaddr_in clientAddr{};
        socklen_t clientAddrLen = sizeof(clientAddr);
        int clientSocket = accept(this->serverSocket, (struct sockaddr*)&clientAddr, &clientAddrLen);

        if (clientSocket >= 0) {
            this->threadManager->addTask(clientSocket);
        } else {
            break;
        }
    }

    this->shutdown();

    return 0;
}

void TCPServer::shutdown() {
    this->active = false;
    close(this->serverSocket);
    this->threadManager->shutdown();
}
