#pragma once

#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <netinet/in.h>
#include <cstring>
#include <unistd.h>

// An interface for different menu interfaces
class IMenu {
    public:
        virtual ~IMenu() = default;

        // Receives a command from the user and extracts first word (the command itself)
        virtual std::vector<std::string> nextCommand() = 0;
        
        // Displays an error message
        virtual void sendOutput(std::string output) = 0;
};
