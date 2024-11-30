#pragma once

#include <stdio.h>
#include <sstream>

#include "ICommand.h"

// The class responsible for the Help command
class HelpCommand : public ICommand {
    public:
        // The implemntation of the Help command
        void execute(std::string command);
};

