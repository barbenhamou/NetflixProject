#include "Tests.h"
#include "../src/Include/HelpCommand.h"

// Generic parsing test
TEST(HelpCommandTests, ExecuteCommandOutput) {
    std::unique_ptr<HelpCommand> helpCommand = std::make_unique<HelpCommand>();
    
    std::string output = helpCommand->execute("");

    std::string expectedOutput =
        "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
        "GET, arguments: [userid] [movieid]\n"
        "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
        "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
        "help\n";

    EXPECT_EQ(output, expectedOutput);
}