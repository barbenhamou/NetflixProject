#include "../Include/App.h"

int main() {
    // Get all info from the file into global variables
    AddCommand::initGlobals("data/user_data.txt");

    std::map<std::string, ICommand*> commands;

    IMenu* menu = new ConsoleMenu();

    ICommand* help = new HelpCommand();
    ICommand* post = new PostCommand();
    ICommand* patch = new PatchCommand();
    ICommand* get = new GetCommand();
    
    // Define the commands
    commands["help"] = help;
    commands["POST"] = post;
    commands["GET"] = get;
    commands["PATCH"] = patch;
    App app(menu, commands);
    app.run();

    delete menu;
    delete help;
    delete post;
    delete patch;
    delete get;
}