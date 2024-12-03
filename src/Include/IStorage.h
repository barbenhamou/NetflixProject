#pragma once

// Interface for storage mechanisms (e.g., file, database, etc.)
class IStorage {
    public:
        // Virtual destructor for proper cleanup in derived classes
        virtual ~IStorage() = default;
};