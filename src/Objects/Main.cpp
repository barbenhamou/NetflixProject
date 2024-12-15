#include "../Include/App.h"
#include "../Include/Globals.h"

int main() {
    // Get all info from the file into global variables
    AddCommand::initGlobals("data/user_data.txt");

    App::createCommands();

    IMenu* menu = new ConsoleMenu();

    App app(menu, commands);
    app.run();

    delete menu;

    App::deleteCommands();
}