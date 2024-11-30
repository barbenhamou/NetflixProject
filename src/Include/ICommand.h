#pragma once

#include <string>
#include <regex>

// An interface which all the commands will inherit from
class ICommand {
    public:
        // All commands will override this function have their own implementation
        virtual void execute(std::string command) = 0;
};
