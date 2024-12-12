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
    ICommand* Post = new PostCommand();
    ICommand* Patch = new PatchCommand();
    ICommand* recommend = new RecommendCommand();
    
    // Define the commands
    commands["help"] = help;
    commands["Post"] = Post;
    commands["recommend"] = recommend;
    commands["Patch"] =Patch ;
    App app(menu, commands);
    app.run();

    delete menu;
    delete help;
    delete Post;
    delete Patch;
    delete recommend;
}