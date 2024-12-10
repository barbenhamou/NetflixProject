#include "../Include/SocketMenu.h"

SocketMenu::SocketMenu(int clientSocket) : clientSocket(clientSocket) {}

std::vector<std::string> SocketMenu::nextCommand() {
    return 0;
}

void displayError(std::string error) {
    return;
}
