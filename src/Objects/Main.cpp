#include "../Include/App.h"

int main(int argc, char* argv[]) {
    if (argc != 2) {
        return 1;
    }

    int server_port = stoi(argv[1]);

    
    // Get all info from the file into global variables
    AddCommand::initGlobals("data/user_data.txt");

    std::map<std::string, ICommand*> commands;

    IMenu* menu = new ConsoleMenu();

    ICommand* help = new HelpCommand();
    ICommand* add = new AddCommand();
    ICommand* recommend = new RecommendCommand();

    // Define the commands
    commands["help"] = help;
    commands["add"] = add;
    commands["recommend"] = recommend;

    App app(menu, commands);
    app.run();

    delete menu;
    delete help;
    delete add;
    delete recommend;
}