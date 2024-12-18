#include <gtest/gtest.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include "../src/Include/TCPServer.h"
#include "../src/Include/ThreadClientManager.h"

// Helper function to simulate a client sending and receiving data
void simulateClientSpecial(const std::string& serverIp, int port, const std::string& message, std::string& response) {
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_NE(clientSocket, -1) << "Client socket creation failed.";

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = inet_addr(serverIp.c_str());
    serverAddr.sin_port = htons(port);

    ASSERT_EQ(connect(clientSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)), 0) << "Failed to connect to server.";

    send(clientSocket, message.c_str(), message.size(), 0);

    char buffer[256] = {0};
    ssize_t bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    if (bytesRead > 0) {
        response = std::string(buffer, bytesRead);
    }

    close(clientSocket);
}

// Test 1: TCPServer starts successfully and accepts a single client
TEST(TCPServerTests, ServerAcceptsSingleClient) {
    ThreadClientManager manager;
    TCPServer server("127.0.0.1", 12345, &manager);

    std::thread serverThread([&server]() {
        EXPECT_EQ(server.activate(), 0);
    });

    sleep(1); // Allow server to start

    std::string response;
    simulateClientSpecial("127.0.0.1", 12345, "test_message\n", response);
    EXPECT_FALSE(response.empty()) << "No response from server.";

    server.shutdown();
    serverThread.join();
}

// Test 2: TCPServer handles multiple clients concurrently
TEST(TCPServerTests, ServerHandlesMultipleClients) {
    ThreadClientManager manager;
    TCPServer server("127.0.0.1", 12346, &manager);

    std::thread serverThread([&server]() {
        EXPECT_EQ(server.activate(), 0);
    });

    sleep(1); // Allow server to start

    const int clientCount = 5;
    std::vector<std::thread> clientThreads;
    std::vector<std::string> responses(clientCount);

    for (int i = 0; i < clientCount; ++i) {
        clientThreads.emplace_back([&responses, i]() {
            simulateClientSpecial("127.0.0.1", 12346, "hello\n", responses[i]);
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
    TCPServer server("127.0.0.1", 12347, &manager);

    std::thread serverThread([&server]() {
        EXPECT_EQ(server.activate(), 0);
    });

    sleep(1); // Allow server to start
    server.shutdown();
    serverThread.join();

    std::string response;
    ASSERT_THROW(simulateClientSpecial("127.0.0.1", 12347, "test\n", response), std::runtime_error);
}
