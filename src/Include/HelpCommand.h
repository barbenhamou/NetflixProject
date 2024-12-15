#pragma once

#include <iostream>
#include <sstream>

#include "ICommand.h"

// A command to display all available commands.
// Syntax: `help`
class HelpCommand : public ICommand {
    public:
        std::string execute(std::string command) override;
};