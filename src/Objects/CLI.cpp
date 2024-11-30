#include "../Include/CLI.h"

void CLI::run() {
    std::vector<std::string> input = {}; // User Input
    std::string command, data; // Result of parsing the user input

    while(true) {
        input = this->menu->nextCommand();
        command = input[0];
        data = input[1];
        
        try {
            this->commands[command]->execute(data); // Executing the function in generic form
        } catch (...) {
            this->menu->displayError("CLI detected an error"); // In case of an error
        }
    }
}
