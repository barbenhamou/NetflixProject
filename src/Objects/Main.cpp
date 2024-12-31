#include "../Include/App.h"
#include "../Include/Globals.h"
#include "../Include/TCPServer.h"

int main(int argc, char* argv[]) {
    if (argc != 2) {
        return -1;
    }

    int port = std::stoi(argv[1]);
    
    // Get all info from the file into global variables
    AddCommand::initGlobals(DATA_FILE);

    App::createCommands();
    
    ThreadPoolManager* manager = new ThreadPoolManager(5);
    TCPServer server(port, manager);
    server.activate();

    delete manager;
    App::deleteCommands();
}