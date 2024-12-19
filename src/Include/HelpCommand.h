#pragma once

#include <iostream>
#include <sstream>

#include "ICommand.h"

// A command to display all available commands, alphabetically (help itself is always last).
class HelpCommand : public ICommand {
    public:
        std::pair<std::string, std::string> toString() override;

        std::string execute(std::string command) override;

        std::vector<std::pair<std::string, ICommand*>> sortCommands();
};