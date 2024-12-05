#include "Tests.h"
#include "../src/Include/HelpCommand.h"

// Generic parsing test
TEST(HelpCommandTest, ExecuteCommandOutput) {
    std::ostringstream capturedOutput;
    std::streambuf* originalCoutBuffer = std::cout.rdbuf(capturedOutput.rdbuf());  // Redirect std::cout to capture the output

    std::unique_ptr<HelpCommand> helpCommand = std::make_unique<HelpCommand>();
    
    helpCommand->execute("");

    std::cout.rdbuf(originalCoutBuffer); // Reset changes regarding cout

    std::string expectedOutput =
        "add [userid] [movieid1] [movieid2] ...\n"
        "recommend [userid] [movieid]\n"
        "help\n";

    EXPECT_EQ(capturedOutput.str(), expectedOutput);
}