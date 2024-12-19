#pragma once

#include "AddCommand.h"

// A command to handle patching (updating) user data in the system.
class PatchCommand : public AddCommand {
public:
    std::pair<std::string, std::string> toString() override;

    std::pair<std::string, StatusCode> execute(std::string command) override;
};