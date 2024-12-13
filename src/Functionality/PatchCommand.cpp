#include "../Include/PatchCommand.h"
#include "../Include/Globals.h"

std::string PatchCommand::execute(std::string command) {
    return executeSpecificAdd(command, PATCH);
}