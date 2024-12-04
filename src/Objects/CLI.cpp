#include "../Include/CLI.h"

std::vector<std::unique_ptr<Movie>> allMovies = {};
std::vector<std::unique_ptr<User>> allUsers = {};

void CLI::run() {
    std::vector<std::string> input = {}; // User Input
    std::string command, data; // Result of parsing the user input

    while(true) {
        input = this->menu->nextCommand();
        command = input[0];
        data = input[1];
        
        try {
            if (this->commands.find(command) == this->commands.end()) continue;
            this->commands[command]->execute(data); // Executing the function in generic form
        } catch (...) {
            this->menu->displayError(""); // In case of an error
        }
    }
}