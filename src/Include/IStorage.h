#pragma once

#include "../Include/MovieUser.h"

// Interface for storage mechanisms (e.g., file, database, etc.)
class IStorage {
    public:
        // Save a User object to storage
    
        // Load a User object from storage by their ID
        virtual User loadUser(int userId) = 0;

        // Virtual destructor for proper cleanup in derived classes
        virtual ~IStorage() = default;
};
