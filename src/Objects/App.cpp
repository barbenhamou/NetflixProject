#include "../Include/App.h"
#include "../Include/Globals.h"

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

            std::cout << statusCodes[commands[command]->getStatus()];

            // Execute the command
            std::cout << this->commands[command]->execute(data);
        } catch (...) {
            // Currenty no error message is needed
            this->menu->displayError("");
        }
    }
}