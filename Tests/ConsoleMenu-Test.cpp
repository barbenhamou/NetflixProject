#include <gtest/gtest.h>
#include <../src/Include/ConsoleMenu.h>
#include <memory>

// Genric parsing test
TEST(ConsoleMenuTest, NextCommandGnericForm) {
    std::istringstream simulatedInput("command arg1 arg2"); // Redirecting the stdin for the test
    std::cin.rdbuf(simulatedInput.rdbuf());

    std::unique_ptr<ConsoleMenu> menu = std::make_unique<ConsoleMenu>();

    std::vector<std::string> result = menu->nextCommand();

    std::vector<std::string> expected = {"command", " arg1 arg2"};

    EXPECT_EQ(result, expected); // Checking the expected output
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}