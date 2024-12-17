#pragma once

#include "AddCommand.h"

// A command to handle posting (creating) a user with data in the system.
// Syntax: `POST [userid] [movieid1] [movieid2] ...`
class PostCommand : public AddCommand {
public:
    std::pair<std::string, std::string> toString() override;

    std::string execute(std::string command) override;
};