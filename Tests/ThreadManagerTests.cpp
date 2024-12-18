#include <gtest/gtest.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include "../src/Include/ThreadClientManager.h"

// Helper function to create a simple server socket
int createTestServerSocket(int port) {
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_NE(serverSocket, -1) << "Failed to create server socket.";

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    ASSERT_EQ(bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)), 0);
    ASSERT_EQ(listen(serverSocket, 5), 0);

    return serverSocket;
}

// Test 1: ThreadClientManager runs a single task successfully
TEST(ThreadClientManagerTests, RunsSingleTask) {
    ThreadClientManager manager;

    int serverSocket = createTestServerSocket(12348);

    std::thread clientThread([]() {
        int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(12348);
        addr.sin_addr.s_addr = inet_addr("127.0.0.1");
        connect(clientSocket, (sockaddr*)&addr, sizeof(addr));
        close(clientSocket);
    });

    sockaddr_in clientAddr;
    socklen_t clientLen = sizeof(clientAddr);
    int clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
    ASSERT_NE(clientSocket, -1);

    manager.addTask(clientSocket);
    clientThread.join();

    close(serverSocket);
    manager.shutdown();
}

// Test 2: ThreadClientManager runs multiple tasks
TEST(ThreadClientManagerTests, RunsMultipleTasks) {
    ThreadClientManager manager;

    int serverSocket = createTestServerSocket(12349);

    const int clientCount = 3;
    std::vector<std::thread> clientThreads;

    for (int i = 0; i < clientCount; ++i) {
        clientThreads.emplace_back([port = 12349]() {
            int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
            sockaddr_in addr{};
            addr.sin_family = AF_INET;
            addr.sin_port = htons(port);
            addr.sin_addr.s_addr = inet_addr("127.0.0.1");
            connect(clientSocket, (sockaddr*)&addr, sizeof(addr));
            close(clientSocket);
        });
    }

    for (int i = 0; i < clientCount; ++i) {
        sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);
        int clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
        ASSERT_NE(clientSocket, -1);
        manager.addTask(clientSocket);
    }

    for (auto& thread : clientThreads) {
        thread.join();
    }

    close(serverSocket);
    manager.shutdown();
}

// Test 3: ThreadClientManager shuts down gracefully without tasks
TEST(ThreadClientManagerTests, GracefulShutdownNoTasks) {
    ThreadClientManager manager;
    ASSERT_NO_THROW(manager.shutdown()) << "Shutdown without tasks should not throw errors.";
}
