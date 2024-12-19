#include "../Include/PatchCommand.h"
#include "../Include/Globals.h"

std::pair<std::string, std::string> PatchCommand::toString() {
    return {"PATCH", "[userid] [movieid1] [movieid2] ..."};
}

std::pair<std::string, StatusCode> PatchCommand::execute(std::string command) {
    return executeSpecificAdd(command, PATCH);
}