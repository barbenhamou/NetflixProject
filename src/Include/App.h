#pragma once

#include <map>
#include <string>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "ConsoleMenu.h"
#include "AddCommand.h"
#include "HelpCommand.h"
#include "GetCommand.h"
#include "DeleteCommand.h"
#include "PostCommand.h"
#include "PatchCommand.h"

// An object which represents the main interface of the app
class App {
    private:
        IMenu* menu;                               // The menu on which commands will run
        std::map<std::string, ICommand*> commands; // Command handler

    public:
        App(IMenu* menu,  std::map<std::string, ICommand*> commands) : menu(menu), commands(commands) {};

        // Starts the app
        void run();

        // Populate the global map of commands
        static void createCommands();

        // Delete all the command pointers from the global map of commands
        static void deleteCommands();
};
