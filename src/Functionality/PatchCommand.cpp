#include "../Include/PatchCommand.h"
#include "../Include/Globals.h"

// Overrides the execute function to handle patch user commands.
std::string PatchCommand::execute(std::string command) {
    return executeSpecificAdd(command, PATCH);
}