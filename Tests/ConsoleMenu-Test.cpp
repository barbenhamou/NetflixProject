#include <gtest/gtest.h>
#include <../src/Include/ConsoleMenu.h>
#include <memory>

TEST(ConsoleMenuTest, NextCommandGnericForm) {
    std::istringstream simulatedInput("command arg1 arg2"); // Redirecting the stdin for the test
    std::cin.rdbuf(simulatedInput.rdbuf());

    // Create an instance of ConsoleMenu
    std::unique_ptr<ConsoleMenu> menu = std::make_unique<ConsoleMenu>();

    // Call the function
    std::vector<std::string> result = menu->nextCommand();

    // Expected result
    std::vector<std::string> expected = {"command", " arg1 arg2"};

    // Check if the result matches the expected value
    EXPECT_EQ(result, expected);
}