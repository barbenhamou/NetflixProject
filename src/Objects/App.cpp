#include "../Include/App.h"
#include "../Include/Globals.h"

void App::run() {
    std::vector<std::string> input = {};
    std::string command, data, output;

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
            output = this->commands[command]->execute(data);

            // Send the status code of the command's execution
            std::cout << statusCodes[commands[command]->getStatus()];
            
            // Send the command's output
            std::cout << output;
        } catch (...) {
            // Currenty no error message is needed
            this->menu->displayError("");
        }
    }
}