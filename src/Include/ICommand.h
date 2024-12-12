#pragma once

#include <string>
#include <regex>

#include "MovieUser.h"
#include "FileStorage.h"

// An interface which all the commands will implement
class ICommand {
    private:
        int status;

    protected:
        void setStatus(int value){
            status=value;
        }
           
    public:
        // All commands will override this function have their own implementation
        virtual void execute(std::string command) = 0;
        
        int getStatus() const{
            return status;
        }
        // Parses the command's arguments and returns them according to the given pattern
        static std::vector<int> parseCommand(std::string command, std::string inputPattern) {
            std::regex pattern(inputPattern);
            std::smatch match;

            // Vector for the numbers in the command
            std::vector<int> extractedNumbers;
            std::string::const_iterator searchStart(command.cbegin());

            while (std::regex_search(searchStart, command.cend(), match, pattern)) {
                // Extract the number as an integer (if not a number, ignore command)
                try {
                    extractedNumbers.push_back(std::stoi(match[1].str()));
                } catch (...) {return {};}

                // Move the search start past this match
                searchStart = match.suffix().first;
            }

            return extractedNumbers;
        }
};
