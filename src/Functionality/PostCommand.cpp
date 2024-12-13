#include "../Include/PostCommand.h"
#include "../Include/Globals.h"

// Overrides the execute function to handle patch user commands.
std::string PostCommand::execute(std::string command) {
    return executeSpecificAdd(command, POST);
}