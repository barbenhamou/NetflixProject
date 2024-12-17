#include "../Include/App.h"
#include "../Include/Globals.h"

int main() {
    // Get all info from the file into global variables
    AddCommand::initGlobals(DATA_FILE);

    IMenu* menu = new ConsoleMenu();

    App::createCommands();

    App app(menu, commands);
    app.run();

    App::deleteCommands();

    delete menu;
}