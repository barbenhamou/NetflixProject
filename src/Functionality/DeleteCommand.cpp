#include "../Include/DeleteCommand.h"
#include "../Include/Globals.h"

std::pair<std::string, std::string> DeleteCommand::toString() {
    return {"DELETE", "[userid] [movieid1] [movieid2] ..."};
}

void DeleteCommand::remove(int userId, std::vector<int> movieIds) {
    return;
}

std::string DeleteCommand::execute(std::string command) {
    return "";
}