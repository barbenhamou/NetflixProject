#pragma once

#include "ICommand.h"
#include "FileStorage.h"

// A command that adds a user to the system along with some movies the user watched.
// This command is split into POST and PATCH, and can't be executed itself.
class AddCommand : public ICommand {
    public:
        enum Functionality {POST, PATCH};

        // Adds movies to a user's watched list. If the user or movies don't already
        // exist in the system, it creates them (they are all stored in global vectors)
        static void add(unsigned int userId, std::vector<unsigned int> movieIds);

        // Adds all the data from the file to the global vectors allUsers and allMovies 
        static void initGlobals(const std::string& fileName);

        // Checks if the add command is valid - PATCH can't be called on a user before POST,
        // and vice versa. Returns {is valid, comman's status code}
        std::pair<bool, StatusCode> checkAddValidity(IStorage* storage, unsigned int userId, Functionality func);

        // Executes the add command but with the specified functionality (post/patch...)
        std::pair<std::string, StatusCode> executeSpecificAdd(const std::string& command, Functionality func);
};