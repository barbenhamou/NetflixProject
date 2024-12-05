#pragma once

// Interface for storage mechanisms (e.g., file, database, etc.)
class IStorage {
    public:
        // Destructor for proper cleanup
        virtual ~IStorage() = default;
};