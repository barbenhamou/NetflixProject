#include "../Include/TCPServer.h"

TCPServer::TCPServer(std::string ip, uint32_t port) : ip(ip), port(port) {

}

int TCPServer::activate() {
    return 0;
}

void TCPServer::shutdown() {
    this->active = false;
    close(this->serverSocket);
    for (auto& thread: this->threads) {
        if (thread.joinable()) {
            thread.join();
        }
    }
}