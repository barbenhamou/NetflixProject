#include <gtest/gtest.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include "../src/Include/TCPServer.h"
#include "../src/Include/ThreadClientManager.h"
#include "Tests.h"

// Helper function to simulate a client sending and receiving data
void simulateClientSpecial(const std::string& serverIp, int port, const std::string& message, std::string& response) {
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_NE(clientSocket, -1) << "Client socket creation failed.";

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = inet_addr(serverIp.c_str());
    serverAddr.sin_port = htons(port);

    if (connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("Client failed to connect");
        close(clientSocket);
        throw std::runtime_error("Connection failed");
    }

    // Send the message
    ssize_t bytesSent = send(clientSocket, message.c_str(), message.size(), 0);
    ASSERT_GT(bytesSent, 0) << "Failed to send message.";

    // Receive response
    char buffer[256] = {0};
    ssize_t bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    if (bytesRead > 0) {
        response = std::string(buffer, bytesRead);
    }

    // Ensure proper socket shutdown
    shutdown(clientSocket, SHUT_RDWR);
    close(clientSocket);
}

// Test helper: Wait for server readiness
bool waitForServerReady(const std::string& ip, int port, int maxWaitMs = 5000) {
    int clientSocket = -1;
    for (int elapsed = 0; elapsed < maxWaitMs; elapsed += 100) {
        clientSocket = socket(AF_INET, SOCK_STREAM, 0);
        if (clientSocket < 0) {
            continue;
        }

        sockaddr_in serverAddr{};
        serverAddr.sin_family = AF_INET;
        serverAddr.sin_addr.s_addr = inet_addr(ip.c_str());
        serverAddr.sin_port = htons(port);

        if (connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == 0) {
            close(clientSocket);
            return true;
        }

        close(clientSocket);
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    return false;
}

// Test 1: TCPServer starts successfully and accepts a single client
TEST(TCPServerTests, ServerAcceptsSingleClient) {
    ThreadClientManager manager;
    int port = randomPort();  // Use a random port
    TCPServer server("127.0.0.1", port, &manager);

    std::atomic<bool> serverReady(false);

    // Start the server thread
    std::thread serverThread([&server, &serverReady]() {
        serverReady = true;
        EXPECT_EQ(server.activate(), 0) << "Server activation failed.";
    });

    ASSERT_TRUE(waitForServerReady("127.0.0.1", port)) << "Server failed to start in time.";

    // Simulate a client
    std::string response;
    simulateClientSpecial("127.0.0.1", port, "test_message\n", response);
    EXPECT_FALSE(response.empty()) << "No response from server.";

    // Shutdown and join server thread
    server.shutdown();
    if (serverThread.joinable()) {
        serverThread.join();
    }
}

// Test 2: TCPServer handles multiple clients concurrently
TEST(TCPServerTests, ServerHandlesMultipleClients) {
    ThreadClientManager manager;
    int port = randomPort();  // Use a random port
    TCPServer server("127.0.0.1", port, &manager);

    std::thread serverThread([&server]() {
        EXPECT_EQ(server.activate(), 0) << "Server failed to start.";
    });

    ASSERT_TRUE(waitForServerReady("127.0.0.1", port)) << "Server failed to start in time.";

    const int clientCount = 5;
    std::vector<std::thread> clientThreads;
    std::vector<std::string> responses(clientCount);

    for (int i = 0; i < clientCount; ++i) {
        clientThreads.emplace_back([&responses, i, port]() {
            simulateClientSpecial("127.0.0.1", port, "hello\n", responses[i]);
        });
    }

    for (auto& thread : clientThreads) {
        thread.join();
    }

    for (const auto& response : responses) {
        EXPECT_FALSE(response.empty()) << "A client did not receive a response.";
    }

    server.shutdown();
    serverThread.join();
}

// Test 3: TCPServer rejects connections after shutdown
TEST(TCPServerTests, ServerRejectsConnectionsAfterShutdown) {
    ThreadClientManager manager;
    int port = randomPort();  // Use a random port
    TCPServer server("127.0.0.1", port, &manager);

    std::thread serverThread([&server]() {
        EXPECT_EQ(server.activate(), 0) << "Server failed to start.";
    });

    ASSERT_TRUE(waitForServerReady("127.0.0.1", port)) << "Server failed to start in time.";

    server.shutdown();
    serverThread.join();

    std::string response;
    ASSERT_THROW(simulateClientSpecial("127.0.0.1", port, "test\n", response), std::runtime_error);
}
