#pragma once

#include <vector>
#include <memory>
#include <map>

#include "MovieUser.h"
#include "ICommand.h"

#define DATA_FILE "data/user_data.txt"

// Global vectors to uniquely store all movies and users
extern std::vector<std::unique_ptr<Movie>> allMovies;
extern std::vector<std::unique_ptr<User>> allUsers;

// Global map for HTTP status codes and their descriptions
extern std::map<int, std::string> statusCodes;

// A map between commands and their objects
extern std::map<std::string, ICommand*> commands;