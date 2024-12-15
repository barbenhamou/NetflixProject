#include "../Include/Globals.h"
#include "../Include/ICommand.h"

std::vector<std::unique_ptr<Movie>> allMovies = {};
std::vector<std::unique_ptr<User>> allUsers = {};

std::map<int, std::string> statusCodes = {
    {None, ""},
    {Ok, "200 Ok"},
    {Created, "201 Created"},
    {NoContent, "204 No Content"},
    {BadRequest, "400 Bad Request"},
    {NotFound, "404 Not Found"}
};

std::map<std::string, ICommand*> commands;