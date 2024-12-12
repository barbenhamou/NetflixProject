#include "../Include/PostCommand.h"

// Overrides the execute function to handle patch user commands.
void PostCommand::execute(std::string command) {
    if (isValidCommand(command, 1)) {
        AddCommand::execute(command);
        ICommand :: setStatus(201);
    }
   
}