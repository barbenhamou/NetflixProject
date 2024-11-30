#pragma once

#include <iostream>
#include <string>
#include <sstream>
#include <vector>

// An interface that all menus will inherit from
class IMenu {
    public:
        // All menus will need to process commands from the user, by implemnting this function
        virtual std::vector<std::string> nextCommand() = 0;
        // All menus will have their own error message
        virtual void displayError(std::string error) = 0;
};
