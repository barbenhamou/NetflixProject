#pragma once

#include "ICommand.h"

// A command that adds a user to the system along with some movies the user watched.
// Syntax: `add [userid] [movieid1] [movieid2] ...`
class AddCommand : public ICommand {
    public:
        // Adds movies to a user's watched list. If the user or movies don't already
        // exist in the system, it creates them (they are all stored in global vectors).
        static void add(int userId, std::vector<int> movieIds);

        void execute(std::string command) override;

        // Adds all the data from the file to the global vectors allUsers and allMovies 
        static void initGlobals(const std::string& fileName);
};