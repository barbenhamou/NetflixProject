#include "Tests.h"

TEST(SocketMenuTests, TestNextCommand) {
    const int port = randomPort();

    int server_sock = simulateServer(port);

    int client_sock;
    std::thread([&]() {client_sock = simulateClient(port);}).detach();

    int test_sock = accept(server_sock, nullptr, nullptr);

    SocketMenu menu(test_sock);

    std::string msg = "command arg1 arg2\n";
    uint32_t msg_size = htonl(msg.size());
    send(client_sock, msg.c_str(), msg.size(), 0);

    std::vector<std::string> res = menu.nextCommand();

    EXPECT_EQ(res.size(), 2);
    EXPECT_EQ(res[0], "command");
    EXPECT_EQ(res[1], " arg1 arg2\n");

    close(client_sock);
    close(test_sock);
    close(server_sock);
}

TEST(SocketMenuTests, TestDisplayError) {
    const int port = 12345;

    int server_sock = simulateServer(port);

    int client_sock;
    std::thread([&]() {client_sock = simulateClient(port);}).detach();

    int test_sock = accept(server_sock, nullptr, nullptr);

    SocketMenu menu(test_sock);

    std::string msg = "command arg1 arg2\n";
    menu.sendOutput(msg);

    uint32_t recved_size = 4095;

    char data[4096] = { 0 };
    int recved = recv(client_sock, data, 4095, 0);

    EXPECT_GT(recved, 0);
    EXPECT_EQ(std::string(data, recved), msg);

    close(client_sock);
    close(test_sock);
    close(server_sock);
}
