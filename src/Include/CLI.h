#pragma once

#include <map>
#include <string>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "MovieUser.h"
#include "ConsoleMenu.h"
#include "AddCommand.h"
#include "HelpCommand.h"
#include "RecommendCommand.h"

// An object which represents the CLI
class CLI {
    private:
        IMenu* menu;
        std::map<std::string, ICommand*> commands;

    public:
        // Constructor for the CLI
        CLI(IMenu* menu,  std::map<std::string, ICommand*> commands) : menu(menu), commands(commands) {};

        // The function which initate the CLI activity
        void run();
};
