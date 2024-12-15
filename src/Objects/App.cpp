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
                this->menu->sendOutput(statusCodes[BadRequest] + "\n");
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