#pragma once

#include "ICommand.h"
#include "FileStorage.h"

// A command that removes movies from a user's watched movies list.
// Trying to remove movies that the user didn't watch is considered an error.
class DeleteCommand : public ICommand {
    public:
        std::string execute(std::string command) override;

        // Removes movies from a user's watch list in the global vectors
        static void remove(int userId, std::vector<int> movieIds);

        std::pair<std::string, std::string> toString() override;
};