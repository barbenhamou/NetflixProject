#include "Tests.h"
#include "../src/Include/TCPServer.h"
#include "../src/Include/ThreadClientManager.h"

// Helper function to simulate a client connection
void simulateClient(const std::string& serverIp, int port, const std::string& message, std::string& response) {
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    EXPECT_NE(clientSocket, -1) << "Client socket creation failed.";

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = inet_addr(serverIp.c_str());
    serverAddr.sin_port = htons(port);

    if (connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("Client failed to connect");
        close(clientSocket);
        throw std::runtime_error("Connection failed.");
    }

    ssize_t sent = send(clientSocket, message.c_str(), message.size(), 0);
    EXPECT_GT(sent, 0) << "Client failed to send message.";

    char buffer[1024] = {0};
    ssize_t received = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    if (received > 0) {
        response = std::string(buffer, received);
    }

    close(clientSocket);
}

// Test 1: Server accepts a single client and responds
/*TEST(TCPServerTests, ServerAcceptsSingleClient) {
    ThreadClientManager manager;
    int port = randomPort();
    TCPServer server(port, &manager);

    std::atomic<bool> serverReady(false);
    std::mutex mtx;
    std::condition_variable cv;

    std::thread serverThread([&]() {
        {
            std::unique_lock<std::mutex> lock(mtx);
            serverReady = true;
            cv.notify_all();
        }
        EXPECT_EQ(server.activate(), 0) << "Server failed to activate.";
    });

    // Wait for the server to be ready
    {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [&]() { return serverReady.load(); });
    }

    std::string response;
    EXPECT_NO_THROW(simulateClient("127.0.0.1", port, "test_message\n", response));
    EXPECT_FALSE(response.empty()) << "Client received no response from server.";

    serverThread.join();
}*/


// A simple client function to connect to the server, send a message, and receive a response.
void simpleClient(const std::string& serverIP, uint16_t port, const std::string& message, std::string& response) {
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_NE(clientSocket, -1) << "Failed to create client socket";

    sockaddr_in serverAddr = {};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, serverIP.c_str(), &serverAddr.sin_addr);

    // Connect to the server
    ASSERT_EQ(connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)), 0) << "Client failed to connect to server";

    // Send the message
    send(clientSocket, message.c_str(), message.size(), 0);

    // Receive the response
    char buffer[1024] = {0};
    ssize_t bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    ASSERT_GT(bytesReceived, 0) << "Failed to receive response from server";

    response = std::string(buffer, bytesReceived);

    close(clientSocket);
}

// The test case for the TCPServer
TEST(TCPServerTests, ServerAcceptsSingleClient) {
    const uint16_t port = 12345;
    const std::string serverIP = "127.0.0.1";
    const std::string testMessage = "This message is sent from the client to the server.\n";
    std::string serverResponse;

    // Create and start the server in a separate thread
    ThreadClientManager* manager = new ThreadClientManager();
    TCPServer server(port, manager);

    std::thread serverThread([&server]() {
        ASSERT_EQ(server.activate(), 0) << "Server activation failed.\n";
    });

    // Allow the server to start
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // Run the client in the main thread
    simpleClient(serverIP, port, testMessage, serverResponse);

    // Check the response from the server
    ASSERT_EQ(serverResponse, "400 Bad Request\n") << "Server response is incorrect.\n";

    // Shut down the server
    server.shutdown();
    serverThread.join();

    delete manager;
}


// Test 2: Server handles multiple concurrent clients
TEST(TCPServerTests, ServerHandlesMultipleClients) {
    ThreadClientManager manager;
    int port = randomPort();
    TCPServer server(port, &manager);

    std::atomic<bool> serverReady(false);
    std::mutex mtx;
    std::condition_variable cv;

    std::thread serverThread([&]() {
        {
            std::unique_lock<std::mutex> lock(mtx);
            serverReady = true;
            cv.notify_all();
        }
        EXPECT_EQ(server.activate(), 0);
    });

    // Wait for the server to be ready
    {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [&]() { return serverReady.load(); });
    }

    const int clientCount = 5;
    std::vector<std::thread> clientThreads;
    std::vector<std::string> responses(clientCount);

    for (int i = 0; i < clientCount; ++i) {
        clientThreads.emplace_back([&, i]() {
            simulateClient("127.0.0.1", port, "hello\n", responses[i]);
        });
    }

    for (auto& thread : clientThreads) {
        thread.join();
    }

    for (const auto& response : responses) {
        EXPECT_FALSE(response.empty()) << "One of the clients did not receive a response.";
    }

    server.shutdown();
    if (serverThread.joinable()) serverThread.join();
}

// Test 3: Server rejects new connections after shutdown
TEST(TCPServerTests, ServerRejectsConnectionsAfterShutdown) {
    ThreadClientManager manager;
    int port = randomPort();
    TCPServer server(port, &manager);

    std::atomic<bool> serverReady(false);
    std::mutex mtx;
    std::condition_variable cv;

    std::thread serverThread([&]() {
        {
            std::unique_lock<std::mutex> lock(mtx);
            serverReady = true;
            cv.notify_all();
        }
        EXPECT_EQ(server.activate(), 0);
    });

    // Wait for the server to be ready
    {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [&]() { return serverReady.load(); });
    }

    server.shutdown();
    if (serverThread.joinable()) serverThread.join();

    std::string response;
    EXPECT_ANY_THROW(simulateClient("127.0.0.1", port, "test\n", response)) << "Server still accepted new connections.";
}
