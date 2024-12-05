#include "Tests.h"

TEST(EndToEnd, EndToEndTest) {
    AddCommand::initGlobals("data/user_data.txt");

    std::map<std::string, ICommand*> commands;

    IMenu* menu = new ConsoleMenu();

    ICommand* help = new HelpCommand();
    ICommand* add = new AddCommand();
    ICommand* recommend = new RecommendCommand();

    commands["help"] = help;
    commands["add"] = add;
    commands["recommend"] = recommend;

    std::vector<std::string> input; // User Input parsed
    std::string command, data, output; // Result of parsing the user input

    std::vector<std::string> userInput = {
        "add 1 100 101 102 103",
        "add 2 101 102 104 105 106",
        "add 3 100 104 105 107 108",
        "add 4 101 105 106 107 109 110",
        "add 5 100 102 103 105 108 111",
        "add 6 100 103 104 110 111 112 113",
        "add 7 102 105 106 107 108 109 110",
        "add 8 101 104 105 106 109 111 114",
        "add 9 100 103 105 107 112 113 115",
        "add 10 100 102 105 106 107 109 110 116",
        "help",
        "recommend 1 104"
    };

    std::istringstream simulatedInput("");
    
    for (const auto& data1 : userInput) {
        simulatedInput.str(data1);
        simulatedInput.clear();

        std::cin.rdbuf(simulatedInput.rdbuf());

        ::testing::internal::CaptureStdout();

        input = menu->nextCommand();
        command = input[0];
        data = input[1];
        
        try {
            if (commands.find(command) == commands.end()) continue;
            commands[command]->execute(data); // Executing the function in generic form
        } catch (...) {
            menu->displayError(""); // In case of an error
        }

        output = ::testing::internal::GetCapturedStdout();

        if (command == "help") {
            EXPECT_EQ(output,"add [userid] [movieid1] [movieid2] ...\nrecommend [userid] [movieid]\nhelp\n");
        } else if (command == "add") {
            EXPECT_EQ(output,"");
        } else if (command == "recommend") {
            EXPECT_EQ(output,"105 106 111 110 112 113 107 108 109 114\n");
        }
    }
    
    delete menu;
    delete help;
    delete add;
    delete recommend;
}