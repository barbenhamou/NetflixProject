#pragma once

#include "ICommand.h"

// A command that adds a user to the system along with some movies the user watched.
// This command splits into POST and PATCH, and can't be executed itself.
class AddCommand : public ICommand {
    public:
        enum Functionality {POST, PATCH};

        // Adds movies to a user's watched list. If the user or movies don't already
        // exist in the system, it creates them (they are all stored in global vectors).
        static void add(int userId, std::vector<int> movieIds);

        // Adds all the data from the file to the global vectors allUsers and allMovies 
        static void initGlobals(const std::string& fileName);

        // Executes the add command but with the specified functionality (post/patch...)
        std::string executeSpecificAdd(const std::string& command, Functionality func);
};