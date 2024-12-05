#include "../Include/App.h"

std::vector<std::unique_ptr<Movie>> allMovies = {};
std::vector<std::unique_ptr<User>> allUsers = {};

void App::run() {
    std::vector<std::string> input = {};
    std::string command, data;

    // The app never stops
    while(true) {
        // Get command and arguments
        input = this->menu->nextCommand();
        command = input[0];
        data = input[1];
        
        try {
            // Ignore invalid commands
            if (this->commands.find(command) == this->commands.end()) continue;
            // Execute the command
            this->commands[command]->execute(data);
        } catch (...) {
            // Currenty no error message is needed
            this->menu->displayError("");
        }
    }
}