#pragma once

#include "IMenu.h"
#include <iostream>

// This class represents the terminal's menu
class ConsoleMenu : public IMenu {
    public:
        // This function will input a command from th user and parse it 
        std::vector<std::string> nextCommand() override;

        // This function will output an error message
        void displayError(std::string error) override;
};
