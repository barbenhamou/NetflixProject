#pragma once

#include "IMenu.h"
#include <iostream>

// A menu in the form of a command-line interface (console)
class ConsoleMenu : public IMenu {
    public:
        std::vector<std::string> nextCommand() override;

        void sendOutput(std::string output) override;
};
