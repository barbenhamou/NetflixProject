#pragma once

#include "ICommand.h"

class AddCommand : public ICommand {
    public:
        static void add(int userId, std::vector<int> movieIds);

        void execute(std::string command);

        static void initGlobals(const std::string& fileName);
};