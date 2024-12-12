#include "../Include/App.h"

std::vector<std::unique_ptr<Movie>> allMovies = {};
std::vector<std::unique_ptr<User>> allUsers = {};
// Global dictionary (map) for HTTP status codes and their descriptions
std::map<int, std::string> statusCodes = {
    {201, "201 Created"},
    {204, "204 No Content"},
    {200, "200 Ok"},
    {404, "404 Not Found"},
    {401, "401 Bad Request"}
};

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
            std:: cout<< statusCodes[commands[command]->getStatus()];
        } catch (...) {
            // Currenty no error message is needed
            this->menu->displayError("");
        }
    }
}