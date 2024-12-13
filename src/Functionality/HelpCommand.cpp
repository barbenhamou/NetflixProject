#include "../Include/HelpCommand.h"
#include "../Include/Globals.h"

std::string HelpCommand::execute(std::string command) {
    // Ensure no arguments are passed
    if (!command.empty()) {
        ICommand::setStatus(BadRequest);
        return "";
    }

    // Alphabetical order, help is last
    return "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
           "GET, arguments: [userid] [movieid]\n"
           "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
           "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
           "help\n";
}