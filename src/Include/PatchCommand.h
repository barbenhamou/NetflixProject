#pragma once

#include "AddCommand.h"

// A command to handle patching user data in the system.
// Syntax: `patch [userid] [movieid1] [movieid2] ...`
class PatchCommand : public AddCommand {
public:
    // Overrides the execute function to handle patch user commands.
    void execute(std::string command) override;
};