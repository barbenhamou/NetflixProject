cmake_minimum_required(VERSION 3.14)
project(FileStorageTest)

# Enable testing
enable_testing()

# Find GoogleTest package
find_package(GTest REQUIRED)

# Include directories for header files
include_directories(
    ${GTEST_INCLUDE_DIRS}           # Google Test includes
    ${CMAKE_SOURCE_DIR}/src/Include # Your project's include directory
)

# Add the executable for ConsoleMenuTest
add_executable(
    Tests    
    Tests/FileStorageTest.cpp
    Tests/MovieTests.cpp
    Tests/ConsoleMenuTest.cpp       # Test file for ConsoleMenu
    Tests/HelpCommandTest.cpp
    src/Objects/ConsoleMenu.cpp     # Source files for ConsoleMenu
    src/Objects/CLI.cpp             # Source files for CLI
    src/Objects/Movie.cpp
    src/Objects/User.cpp
    src/Functionality/HelpCommand.cpp
    src/FileHandling/FileStorage.cpp

)

# Link GoogleTest and pthread libraries to the ConsoleMenuTest executable
target_link_libraries(
    Tests
    ${GTEST_LIBRARIES}
    pthread
)

# Register the test with CTest
add_test(
    NAME HelpCommandTest
    COMMAND HelpCommandTest
)

add_test(
    NAME ConsoleMenuTest
    COMMAND ConsoleMenuTest
)

add_test(
    NAME MovieTests
    COMMAND MovieTests
)

add_test(
    NAME FileStorageTest
    COMMAND FileStorageTest
)

