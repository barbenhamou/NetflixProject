#include "Tests.h"
#include "../src/Include/TCPServer.h"
#include "../src/Include/ThreadClientManager.h"
#include "../src/Include/AddCommand.h"
#include "../src/Include/GetCommand.h"
#include "../src/Include/PatchCommand.h"
#include "../src/Include/PostCommand.h"
#include "../src/Include/Globals.h"

// Helper function to simulate a client request and response
std::string simulateClientRequest(const std::string& serverIp, int port, const std::string& request) {
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (clientSocket < 0) {
        perror("Error creating client socket");
        return "";
    }

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = inet_addr(serverIp.c_str());
    serverAddr.sin_port = htons(port);

    if (connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("Error connecting to server");
        close(clientSocket);
        return "";
    }

    // Send the request
    send(clientSocket, request.c_str(), request.size(), 0);

    // Receive the response
    char buffer[1024] = {0};
    ssize_t bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);

    close(clientSocket);

    if (bytesRead > 0) {
        return std::string(buffer, bytesRead);
    }

    return "";
}

TEST(EndToEndTests2, FullFunctionalityWithPosts) {
    App::createCommands();

    ThreadClientManager manager;
    TCPServer server(12345, &manager);

    // Start server in a separate thread
    std::thread serverThread([&server]() {
        EXPECT_EQ(server.activate(), 0);
    });

    // Allow server to start
    sleep(1);

    // -------- Initialize data using POST commands --------
    std::vector<std::pair<int, std::vector<int>>> initialData = {
        {1, {100, 101, 102, 103}},
        {2, {101, 102, 104, 105, 106}},
        {3, {100, 104, 105, 107, 108}},
        {4, {101, 105, 106, 107, 109, 110}},
        {5, {100, 102, 103, 105, 108, 111}},
        {6, {100, 103, 104, 110, 111, 112, 113}},
        {7, {102, 105, 106, 107, 108, 109, 110}},
        {8, {101, 104, 105, 106, 109, 111, 114}},
        {9, {100, 103, 105, 107, 112, 113, 115}},
        {10, {100, 102, 105, 106, 107, 109, 110, 116}}
    };

    for (const auto& [userId, movies] : initialData) {
        std::ostringstream postCommand;
        postCommand << "POST " << userId;
        for (const auto& movieId : movies) {
            postCommand << " " << movieId;
        }
        postCommand << "\n";

        std::string postResponse = simulateClientRequest("127.0.0.1", 12345, postCommand.str());
        EXPECT_EQ(postResponse, "201 Created\n") << "Failed to add user " << userId << " with movies.";
    }

    // -------- Test Case 1: GET 1 104 --------
    std::string getRequest = "GET 1 104\n";
    std::string getResponse = simulateClientRequest("127.0.0.1", 12345, getRequest);
    std::string expectedOutput = "105 106 111 110 112 113 107 108 109 114";
    EXPECT_EQ(getResponse, "200 Ok\n\n" + expectedOutput + "\n");

    // -------- Test Case 2: POST - Add a new user + multiple spaces --------
    std::string postRequest = "POST  11   120    121        122\n";
    std::string postResponse = simulateClientRequest("127.0.0.1", 12345, postRequest);
    EXPECT_EQ(postResponse, "201 Created\n");

    // -------- Test Case 3: PATCH - Update user 1 --------
    std::string patchRequest = "PATCH 1 104 105\n";
    std::string patchResponse = simulateClientRequest("127.0.0.1", 12345, patchRequest);
    EXPECT_EQ(patchResponse, "204 No Content\n");

    // -------- Test Case 4: Invalid Command --------
    std::string invalidRequest = "UNKNOWNCOMMAND 123\n";
    std::string invalidResponse = simulateClientRequest("127.0.0.1", 12345, invalidRequest);
    EXPECT_EQ(invalidResponse, "400 Bad Request\n");

    // -------- Test Case 5: GET with Invalid User --------
    std::string invalidGetRequest = "GET 999 104\n";
    std::string invalidGetResponse = simulateClientRequest("127.0.0.1", 12345, invalidGetRequest);
    EXPECT_EQ(invalidGetResponse, "404 Not Found\n");

    // -------- Test Case 6: HELP Command --------
    std::string helpRequest = "help\n";
    std::string helpResponse = simulateClientRequest("127.0.0.1", 12345, helpRequest);
    std::string expectedHelpOutput = 
        "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
        "GET, arguments: [userid] [movieid]\n"
        "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
        "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
        "help\n";
    EXPECT_EQ(helpResponse, "200 Ok\n\n" + expectedHelpOutput);

    // -------- Test Case 7: PATCH - Update non-existing user --------
    std::string patchInvalidUser = "PATCH 999 104 105\n";
    std::string patchInvalidUserResponse = simulateClientRequest("127.0.0.1", 12345, patchInvalidUser);
    EXPECT_EQ(patchInvalidUserResponse, "404 Not Found\n");

    // -------- Test Case 8: POST - Add an existing user --------
    std::string postExistingUser = "POST 1 200 201\n";
    std::string postExistingResponse = simulateClientRequest("127.0.0.1", 12345, postExistingUser);
    EXPECT_EQ(postExistingResponse, "404 Not Found\n");

    // Shutdown server
    server.shutdown();
    serverThread.join();

    // Cleanup
    App::deleteCommands();
}
