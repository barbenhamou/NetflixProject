#pragma once

#include "ICommand.h"

// Interface for storage mechanisms (e.g., file, database, etc.)
class IStorage {
    public:
        virtual ~IStorage() = default;

        enum Change {
            Add,
            Remove
        };

        // Adds or removes movies from a user's movie list in the storage.
        // If `change == Add` and the user doesn't exist, it creates it.
        // If there is an error it returns the error code, otherwise `None`.
        virtual StatusCode updateUserData(int userId, std::vector<int>& movies, Change change) = 0;

        // Checks if the user exists in the storage. If so, it will return a
        // vector of its watched movies (otherwise -1). The vector type is long long
        // because movie IDs are unsigned int, so in order to return a vector with -1
        // in addition to any unsigned integer we chose to return long long, which has both.
        virtual std::vector<long long> isUserInStorage(int userId) = 0;
};