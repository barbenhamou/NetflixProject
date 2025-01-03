cmake_minimum_required(VERSION 3.14)
project(FileStorageTest)

enable_testing()

# Find GoogleTest package
find_package(GTest REQUIRED)

# Include directories for header files
include_directories(
    ${GTEST_INCLUDE_DIRS}           # Google Test includes
    ${CMAKE_SOURCE_DIR}/src/Include # Project's includes directory
)

# Add the executables
add_executable(
    Tests
    #Tests/TCPServerTests.cpp
    #Tests/ThreadManagerTests.cpp
    Tests/SocketMenuTests.cpp
    Tests/FileStorageTests.cpp
    Tests/ConsoleMenuTests.cpp
    Tests/MovieTests.cpp
    Tests/PatchCommandTests.cpp
    Tests/PostCommandTests.cpp
    Tests/HelpCommandTests.cpp
    Tests/AddCommandTests.cpp    
    Tests/GetCommandTests.cpp
    Tests/DeleteCommandTests.cpp
    #Tests/EndToEndTests2.cpp

    src/Objects/SocketMenu.cpp
    src/Objects/ConsoleMenu.cpp
    src/Objects/App.cpp
    src/Objects/Movie.cpp
    src/Objects/User.cpp
    src/Objects/Globals.cpp
    src/Objects/TCPServer.cpp
    src/Objects/ThreadClientManager.cpp
    src/Objects/ClientHandler.cpp

    src/Functionality/AddCommand.cpp
    src/Functionality/HelpCommand.cpp
    src/Functionality/GetCommand.cpp
    src/Functionality/PostCommand.cpp
    src/Functionality/PatchCommand.cpp
    src/Functionality/DeleteCommand.cpp
    
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
    NAME ConsoleMenuTests
    COMMAND ConsoleMenuTests
)

add_test(
    NAME FileStorageTests
    COMMAND FileStorageTests
)

add_test(
    NAME MovieTests
    COMMAND MovieTests
)

add_test(
    NAME HelpCommandTests
    COMMAND HelpCommandTests
)

add_test(
    NAME AddCommandTests
    COMMAND AddCommandTests
)

add_test(
    NAME RecommendationTests
    COMMAND RecommendationTests
)

add_test(
   NAME EndToEndTests2
    COMMAND EndToEndTests2
)

add_test(
    NAME SocketMenuTests
    COMMAND SocketMenuTests
)

add_test(
    NAME PatchCommandTests
    COMMAND PatchCommandTests
)

add_test(
    NAME PostCommandTests
    COMMAND PostCommandTests
)

add_test(
    NAME DeleteCommandTests
    COMMAND DeleteCommandTests
)

#add_test(
#    NAME TCPServerTests
#    COMMAND TCPServerTests
#)

#add_test(
#    NAME ThreadClientManagerTests
#    COMMAND ThreadClientManagerTests
#)