#include "../Include/App.h"
#include "../Include/Globals.h"

void App::run() {
    std::vector<std::string> input = {};
    std::string command, data, output, status;

    // The app never stops
    while(true) {
        // Get command and arguments
        input = this->menu->nextCommand();
        
        try {
            if (input.empty()) {
                break;
            }

            command = input[0];
            data = input[1];

            // Invalid commands
            if (this->commands.find(command) == this->commands.end()) {
                this->menu->sendOutput(statusCodes[BadRequest] + "\n");
                continue;
            }

            // Execute the command
            auto execution = this->commands[command]->execute(data);
            output = execution.first;

            // The status code of the command's execution
            status = statusCodes[execution.second];
            
            if (!output.empty()) {
                output = "\n\n" + output;
            }

            // Send the command's output
            this->menu->sendOutput(status + output + "\n");
        } catch (...) {
            // Invalid command
            this->menu->sendOutput(statusCodes[BadRequest] + "\n");
        }
    }
}

void App::createCommands() {
    ICommand* Help = new HelpCommand();
    ICommand* Post = new PostCommand();
    ICommand* Patch = new PatchCommand();
    ICommand* Get = new GetCommand();
    ICommand* Delete = new DeleteCommand();
    
    // Define the commands
    ::commands[Help->toString().first] = Help;
    ::commands[Post->toString().first] = Post;
    ::commands[Patch->toString().first] = Patch;
    ::commands[Get->toString().first] = Get;
    ::commands[Delete->toString().first] = Delete;
}

void App::deleteCommands() {
    for (const auto& command : ::commands) {
        delete command.second;
    }
}