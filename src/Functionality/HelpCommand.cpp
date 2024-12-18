#include "../Include/HelpCommand.h"
#include "../Include/Globals.h"

std::pair<std::string, std::string> HelpCommand::toString() {
    return {"help", ""};
}

std::vector<std::pair<std::string, ICommand*>> HelpCommand::sortCommands() {
    // A vector for the commands
    std::vector<std::pair<std::string, ICommand*>> commandsVec(commands.begin(), commands.end());

    // Sort the commands alphabetically
    std::sort(commandsVec.begin(), commandsVec.end(), [](const auto& a, const auto& b) {
        return a.second->toString().first < b.second->toString().first;
    });

    return commandsVec;
}

std::string HelpCommand::execute(std::string command) {
    // Ensure no arguments are passed
    if (!command.empty() && command != "\n") {
        ICommand::setStatus(BadRequest);
        return "";
    }

    std::string output;

    auto commandsVec = sortCommands();

    // Add "[command], arguments: [args]\n" for each command to the output
    for (const auto& command : commandsVec) {
        std::string commandStr = command.second->toString().first;

        if (commandStr == "help") continue;
        
        output += commandStr;

        std::string args = command.second->toString().second;
        if (!args.empty()) {
            output += ", arguments: " + args;
        }

        output += "\n";
    }

    // Add help at the end
    output += this->toString().first;

    ICommand::setStatus(Ok);
    return output;
}