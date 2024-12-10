#include "../Include/SocketMenu.h"

SocketMenu::SocketMenu(int clientSocket) : clientSocket(clientSocket) {}

int SocketMenu::nextCommand() {
    return 0;
}

void displayError(std::string error) {
    return;
}
