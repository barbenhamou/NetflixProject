#pragma once

#include <stdio.h>

#include "ICommand.h"

class HelpCommand : public ICommand {
    public:
        void execute(std::string command);
};

