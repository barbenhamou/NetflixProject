#pragma once

#include "AddCommand.h"

class PostCommand : public AddCommand {
public:
    // Overrides the execute function to handle patch user commands.
    std::string execute(std::string command) override;
};