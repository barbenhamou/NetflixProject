#pragma once

#include <string>
#include <regex>
#include <mutex>
#include <shared_mutex>

#include "MovieUser.h"

enum StatusCode {
    None = -1,
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404
};

// An interface which all the commands will implement
class ICommand {
    protected:
        // A mutex that ensures only one command executes at a time
        // (except for commands that don't use shared resources)
        static std::shared_mutex commandMutex;

    public:
        virtual ~ICommand() = default;

        // Executes the command. Returns {command's output, command's status code}
        virtual std::pair<std::string, StatusCode> execute(std::string command) = 0;

        // Returns {command, arguments}
        virtual std::pair<std::string, std::string> toString() = 0;

        // Parses the command's arguments and returns them according to the given pattern.
        // Upon error (an argument is not a number) returns an empty vector
        static std::vector<int> parseCommand(std::string command, std::string inputPattern) {
            std::regex pattern(inputPattern);
            std::smatch match;

            // Vector for the numbers in the command
            std::vector<int> extractedNumbers;
            std::string::const_iterator searchStart(command.cbegin());

            while (std::regex_search(searchStart, command.cend(), match, pattern)) {
                // Extract the number as an integer (if not a number, return {})
                try {
                    extractedNumbers.push_back(std::stoi(match[1].str()));
                } catch (...) {return {};}

                // Move the search start past this match
                searchStart = match.suffix().first;
            }

            return extractedNumbers;
        }

        // If `numbers` contains a negative number it returns true, otherwise false
        static bool checkForNegative(std::vector<int> numbers) {
            for (const auto& num : numbers) {
                if (num < 0) return true;
            }

            return false;
        }
};