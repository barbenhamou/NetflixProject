#include "../Include/App.h"
#include "../Include/Globals.h"
#include "../Include/TCPServer.h"

int main(int argc, char* argv[]) {
    if (argc != 3) {
        return -1;
    }

    int port = std::stoi(argv[1]);
    
    // Get all info from the file into global variables
    AddCommand::initGlobals(DATA_FILE);

    App::createCommands();

    // IMenu* menu = new ConsoleMenu();

    // App app(menu, commands);
    // app.run();

    // delete menu;

    ThreadClientManager* manager = new ThreadClientManager();
    TCPServer server(argv[2], port, manager);
    server.activate();

    delete manager;
    App::deleteCommands();
}