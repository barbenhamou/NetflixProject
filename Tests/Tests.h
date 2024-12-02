#pragma once

#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <vector>
#include <memory>
#include <iostream>
#include <unordered_set>

#define TEST_FILE "../data/test_user_data.txt"

// Generate a random whole number between a and b (inclusive)
inline int randInt(int a, int b) {
    std::srand(std::time(0));
    return std::rand() % (b - a + 1) + a;
}