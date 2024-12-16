#include "../Include/ClientHandler.h"

ClientHandler::ClientHandler(int clientSocket) {
    this->clientSocket = clientSocket;
    this->menu = new SocketMenu(this->clientSocket);
    this->app(commands, this->menu);
}

void ClientHandler::interact() {
    this->app.run();
    
    delete menu;
}