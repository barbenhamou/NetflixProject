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
#include "../Include/PostCommand.h"
#include "../Include/PatchCommand.h"

// An object which represents the main interface of the app
class App {
    private:
        IMenu* menu;                               // The menu on which commands will run
        std::map<std::string, ICommand*> commands; // Command handler

    public:
        App(IMenu* menu,  std::map<std::string, ICommand*> commands) : menu(menu), commands(commands) {};

        // Starts the app
        void run();
};
