#include "../Include/PostCommand.h"
#include "../Include/Globals.h"

std::string PostCommand::execute(std::string command) {
    return executeSpecificAdd(command, POST);
}