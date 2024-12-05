#include "Tests.h"

std::vector<std::vector<Movie*>> generateTwoVectors(int num, int size) {
    std::vector<Movie*> vector1, vector2;
    std::vector<std::vector<Movie*>> ret;

    // One vector with even numbers and one with numbers divisible by 3
    for (int i = num; i < num + size; i++) {
        if (i % 2 == 0) {
            vector1.push_back(new Movie(i));
        }
        if (i % 3 == 0) {
            vector2.push_back(new Movie(i));
        }
    }

    ret.push_back(vector1);
    ret.push_back(vector2);
    return ret;
}

TEST(MovieTest, Intersection) {
    int sizeOfVector = randInt(5,20);
    
    std::vector<Movie*> correct;
    std::vector<std::vector<Movie*>> vectors;

    for (int i = 1; i < 21; i++) {

        correct = {};

        for (int j = i; j < i + sizeOfVector; j++) {
            // Only numbers divisible by 6 should be in the result
            if (j % 6 == 0) {
                correct.push_back(new Movie(j));
            }
        }
        
        vectors = generateTwoVectors(i, sizeOfVector);

        auto intersectionResult = Movie::intersection(vectors[0], vectors[1]);

        ASSERT_TRUE(compareVec(correct, intersectionResult));
    }

    // Edge cases - intersection with empty sets
    auto empty1 = Movie::intersection({}, vectors[1]);
    ASSERT_TRUE(compareVec(empty1, {}));

    auto empty2 = Movie::intersection(vectors[0], {});
    ASSERT_TRUE(compareVec(empty2, {}));
}

TEST(MovieTest, RelativeComplement) {
    int sizeOfVector = randInt(5,20);
    
    std::vector<Movie*> correct1, correct2;
    std::vector<std::vector<Movie*>> vectors;

    for (int i = 1; i < 21; i++) {
        correct1 = {};
        correct2 = {};

        for (int j = i; j < i + sizeOfVector; j++) {
            if (j % 3 != 0 && j % 2 == 0) {
                correct1.push_back(new Movie(j));
            }

            if (j % 3 == 0 && j % 2 != 0) {
                correct2.push_back(new Movie(j));
            }
        }

        vectors = generateTwoVectors(i, sizeOfVector);

        auto result1 = Movie::relativeComplement(vectors[0], vectors[1]);
        auto result2 = Movie::relativeComplement(vectors[1], vectors[0]);

        ASSERT_TRUE(compareVec(correct1, result1));
        ASSERT_TRUE(compareVec(correct2, result2));
    }

    // Edge cases: A\B - 1. B=emptySet 2. A=emptySet
    auto empty = Movie::relativeComplement({}, vectors[1]);
    ASSERT_TRUE(compareVec(empty, {}));

    auto full = Movie::relativeComplement(vectors[0], {});
    ASSERT_TRUE(compareVec(full, vectors[0]));
}