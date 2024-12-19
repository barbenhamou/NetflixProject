#include "../Include/ClientHandler.h"

ClientHandler::ClientHandler(int clientSocket) {
    this->clientSocket = clientSocket;
    this->menu = new SocketMenu(this->clientSocket);
    this->app = new App(this->menu, commands);
}

void ClientHandler::interact() {
    this->app->run();
    
    delete this->menu;
    delete this->app;
}