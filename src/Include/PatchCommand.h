#pragma once

#include "AddCommand.h"

// A command to handle patching (updating) user data in the system.
// Syntax: `PATCH [userid] [movieid1] [movieid2] ...`
class PatchCommand : public AddCommand {
public:
    std::pair<std::string, std::string> toString() override;

    std::string execute(std::string command) override;
};