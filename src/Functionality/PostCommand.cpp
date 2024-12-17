#include "../Include/PostCommand.h"
#include "../Include/Globals.h"

std::pair<std::string, std::string> PostCommand::toString() {
    return {"POST", "[userid] [movieid1] [movieid2] ..."};
}

std::string PostCommand::execute(std::string command) {
    return executeSpecificAdd(command, POST);
}