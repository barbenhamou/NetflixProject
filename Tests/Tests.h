#pragma once

#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <vector>
#include <memory>
#include <iostream>
#include <unordered_set>
#include <random>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <thread>
#include <unistd.h>

#include "../src/Include/MovieUser.h"
#include "../src/Include/App.h"
#include "../src/Include/SocketMenu.h"

#define TEST_FILE "../data/test_user_data.txt"
#define MAX_ID 50

// Generate a random whole number between a and b (inclusive)
inline int randInt(int a, int b) {
    std::srand(std::random_device()());
    return std::rand() % (b - a + 1) + a;
}

// Check if two Movie* vectors are equal (EXPECT_EQ compares the addresses)
inline bool compareVec(std::vector<Movie*> a, std::vector<Movie*> b) {
    if (a.size() != b.size()) return false;
    for (int i = 0; i < a.size(); i++) {
        if (a[i]->getId() != b[i]->getId()) return false;
    }
    return true;
}

inline int randomPort() {
    const int minPort = 1024;  // Avoid system-reserved ports
    const int maxPort = 65535;
    return randInt(minPort, maxPort);
}

inline int simulateServer(int port) {
    int server_sock = socket(AF_INET, SOCK_STREAM, 0);

    if (server_sock < 0) {
       perror("error creating socket");
       exit(-1);
    }

    struct sockaddr_in server_addr;

    memset(&server_addr, 0, sizeof(server_addr));

    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(port);

    if (bind(server_sock, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("error binding socket");
        close(server_sock);
        exit(-1);
    }

    if (listen(server_sock, 1) < 0) {
        perror("error listening socket");
        close(server_sock);
        exit(-1);
    }

    return server_sock;
}

inline int simulateClient(int port) {
    int client_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (client_sock < 0) {
        perror("error creating socket");
        exit(-1);
    }

    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    server_addr.sin_port = htons(port);

    if (connect(client_sock, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("error connecting");
        close(client_sock);
        exit(-1);
    }

    return client_sock;
}

inline void generateRandomAddCommand(int minMovies, int maxMovies, int& userId, std::vector<int>& movies, std::string& command) {
    // Generate a random user ID between 1 and 1000
    userId = randInt(1, 100);

    // Generate a random number of movies (minMovies to maxMovies)
    int numMovies = randInt(minMovies, maxMovies);

    // Clear the movies vector
    movies.clear();

    // Populate the movies vector with random movie IDs (1 to 1000)
    for (int i = 0; i < numMovies; i++) {
        int movieId = randInt(1, 100);
        movies.push_back(movieId);
    }

    // Construct the command string
    std::ostringstream commandStream;
    commandStream << userId;  // Start with the user ID
    for (int movieId : movies) {
        commandStream << " " << movieId;  // Append each movie ID
    }

    // Convert to a string
    command = commandStream.str();
}