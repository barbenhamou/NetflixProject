#include "Tests.h"

TEST(SocketMenuTest, TestNextCommand) {
    const int port = 5555;

    int server_sock = simulateServer(port);

    int client_sock;
    std::thread([&]() {client_sock = simulateClient(port);}).detach();

    int test_sock = accept(server_sock, nullptr, nullptr);

    SocketMenu menu(test_sock);

    std::string msg ="command arg1 arg2\n";
    send(client_sock, msg.c_str(), msg.size(), 0);

    std::vector<std::string> res = menu.nextCommand();

    ASSERT_EQ(result.size(), 2);
    EXPECT_EQ(result[0], "command");
    EXPECT_EQ(result[1], "arg1 arg2");

    close(client_sock);
    close(test_sock);
    close(server_sock);
}

TEST(SocketMenuTest, TestDisplayError) {
    const int port = 12345;

    int server_sock = simulateServer(port);

    int client_sock;
    std::thread([&]() {client_sock = simulateClient(port);}).detach();

    int test_sock = accept(server_sock, nullptr, nullptr);

    SocketMenu menu(test_sock);

    std::string msg ="command arg1 arg2\n";
    menu.displayError(msg);

    char data[4096] = { 0 };
    int recved = recv(client_sock, data, sizeof(data) - 1, 0);

    ASSERT_GT(recved, 0);
    EXPECT_EQ(std::string(data), msg + "\n");

    close(client_sock);
    close(test_sock);
    close(server_sock);
}