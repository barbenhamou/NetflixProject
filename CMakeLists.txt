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
    Tests/SocketMenuTests.cpp
    Tests/PatchCommandTests.cpp
    Tests/PostCommandTests.cpp
    Tests/FileStorageTests.cpp
    Tests/ConsoleMenuTests.cpp
    Tests/MovieTests.cpp
    Tests/HelpCommandTests.cpp
    Tests/AddCommandTests.cpp    
    Tests/GetCommandTests.cpp
    Tests/EndToEndTests.cpp

    src/Objects/SocketMenu.cpp
    src/Objects/ConsoleMenu.cpp
    src/Objects/App.cpp
    src/Objects/Movie.cpp
    src/Objects/User.cpp

    src/Functionality/AddCommand.cpp
    src/Functionality/HelpCommand.cpp
    src/Functionality/GetCommand.cpp
    src/Functionality/PostCommand.cpp
    src/FileHandling/FileStorage.cpp
    src/Functionality/PatchCommand.cpp
)

# Link GoogleTest and pthread libraries to the ConsoleMenuTest executable
target_link_libraries(
    Tests
    ${GTEST_LIBRARIES}
    pthread
)

# Register the test with CTest
add_test(
    NAME ConsoleMenuTest
    COMMAND ConsoleMenuTest
)

add_test(
    NAME FileStorageTest
    COMMAND FileStorageTest
)

add_test(
    NAME MovieTests
    COMMAND MovieTests
)

add_test(
    NAME HelpCommandTest
    COMMAND HelpCommandTest
)

add_test(
    NAME AddFunctionTests
    COMMAND AddFunctionTests
)

add_test(
    NAME RecommendationTests
    COMMAND RecommendationTests
)

add_test(
    NAME EndToEnd
    COMMAND EndToEnd
)

add_test(
    NAME SocketMenuTest
    COMMAND SocketMenuTest
)

add_test(
    NAME PatchFunctionTests
    COMMAND PatchFunctionTests
)

add_test(
    NAME PostFunctionTests
    COMMAND PostFunctionTests
)