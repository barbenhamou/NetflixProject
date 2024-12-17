#include "../Include/App.h"
#include "../Include/Globals.h"

int main(int argc, char* argv[]) {
    if (argc != 2) {
        return 1;
    }

    int server_port = stoi(argv[1]);

    
    // Get all info from the file into global variables
    AddCommand::initGlobals("data/user_data.txt");

    App::createCommands();

    IMenu* menu = new ConsoleMenu();

    App app(menu, commands);
    app.run();

    delete menu;

    App::deleteCommands();
}