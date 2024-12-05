#include "../Include/ConsoleMenu.h"

std::vector<std::string> ConsoleMenu::nextCommand() {
    std::string command, input;

    // Get a command from stdin
    std::getline(std::cin, input);

    // Initialize a stream
    std::istringstream ss(input);

    // Get the first word
    ss >> command;

    // return the command and its arguments
    return {command, input.substr(command.size())};
}

void ConsoleMenu::displayError(std::string error) {
    // Print the error to stdout
    std::cout << error << std::endl;
}
