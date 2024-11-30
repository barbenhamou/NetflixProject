#include "../Include/ConsoleMenu.h"

// The next command will input a command from the user and analyze it
std::vector<std::string> ConsoleMenu::nextCommand() {
    std::vector<std::string> returnObj = {};
    std::string command, input;

    std::getline(std::cin, input); // Inputing from cin

    std::istringstream ss(input); // Initializing stream

    ss >> command; // Getting the first word

    returnObj.push_back(command);
    returnObj.push_back(input.substr(command.size())); // Creating the vector to return

    return returnObj;
}

// Displaying an error
void displayError(std::string error) {
    std::cout << error << std::endl;
}
