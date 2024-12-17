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
            // Invalid commands
            if (this->commands.find(command) == this->commands.end()) {
                this->menu->sendOutput(statusCodes[BadRequest]);
                continue;
            }

            // Execute the command
            output = this->commands[command]->execute(data);

            // Send the status code of the command's execution
            this->menu->sendOutput(statusCodes[this->commands[command]->getStatus()]);
            
            if (!output.empty()) {
                output = "\n\n" + output;
            }

            // Send the command's output
            this->menu->sendOutput(output + "\n");
        } catch (...) {
            // Invalid command
            this->menu->sendOutput(statusCodes[BadRequest]);
        }
    }
}

void App::createCommands() {
    ICommand* help = new HelpCommand();
    ICommand* post = new PostCommand();
    ICommand* patch = new PatchCommand();
    ICommand* get = new GetCommand();
    
    // Define the commands
    ::commands[help->toString().first] = help;
    ::commands[post->toString().first] = post;
    ::commands[get->toString().first] = get;
    ::commands[patch->toString().first] = patch;
}

void App::deleteCommands() {
    for (const auto& command : ::commands) {
        delete command.second;
    }
}