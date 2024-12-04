#include "../Include/CLI.h"

// Main function to check and parse the command
int main() {
    AddCommand::initGlobals("data/user_data.txt");

    std::map<std::string, ICommand*> commands;

    IMenu* menu = new ConsoleMenu();

    ICommand* help = new HelpCommand();
    ICommand* add = new AddCommand();
    ICommand* recommend = new RecommendCommand();

    commands["help"] = help;
    commands["add"] = add;
    commands["recommend"] = recommend;

    CLI cli(menu, commands);
    cli.run();
}