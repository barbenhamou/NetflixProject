#pragma once

#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <vector>
#include <memory>
#include <iostream>
#include <unordered_set>
#include <random>

#include "../src/Include/MovieUser.h"
#include "../src/Include/App.h"

#define TEST_FILE "../data/test_user_data.txt"

// Generate a random whole number between a and b (inclusive)
inline int randInt(int a, int b) {
    std::srand(std::time(0));
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