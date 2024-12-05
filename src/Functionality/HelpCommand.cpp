#include "../Include/HelpCommand.h"

void HelpCommand::execute(std::string command) {
    std::cout << "add [userid] [movieid1] [movieid2] ..." << std::endl;
    std::cout << "recommend [userid] [movieid]" << std::endl;
    std::cout << "help" << std::endl;
}