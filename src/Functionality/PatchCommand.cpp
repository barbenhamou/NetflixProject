#include "../Include/PatchCommand.h"

// Overrides the execute function to handle patch user commands.
void PatchCommand::execute(std::string command) {
    if (isValidCommand(command, 2)) {
        AddCommand::execute(command);
        ICommand :: setStatus(204);
    }
}