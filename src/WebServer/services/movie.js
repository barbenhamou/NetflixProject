const Movie = require('../models/movie');
const User = require('../models/user');
const Category = require('../models/category');
const categoryService = require('./category');
const userService = require('./user');
const errorClass = require("../ErrorHandling");
const ClientClass = require("../Client");
const movie = require('../models/movie');

// Recommendation system address
const PORT = process.env.CPP_PORT;
const IP = process.env.SERVER_IP;

const getMovies = async (userId) => {
    const MOVIES_PER_CATEGORY = 20

    try {
        // Get the user's watched movies
        const user = await userService.getUserById(userId);
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }
        const watchedMovieIds = user.watchedMovies;

        // Get up to MOVIES_PER_CATEGORY movies the user has watched
        const watchedMovies = await Movie.find({
            _id: { $in: watchedMovieIds } // Include only watched movies
        }).limit(MOVIES_PER_CATEGORY).exec();

        // Get all promoted categories
        const promotedCategories = await Category.find({ promoted: true }).exec();

        if (!promotedCategories || promotedCategories.length === 0) {
            // No promoted categories, return just the watched movies
            return watchedMovies;
        }

        // Get up to MOVIES_PER_CATEGORY unwatched movies of each promoted category
        const moviesByCategory = await Promise.all(
            promotedCategories.map(async (category) => {
                return movies = await Movie.find({
                    categories: category._id,
                    _id: { $nin: watchedMovieIds } // Exclude watched movies
                }).limit(MOVIES_PER_CATEGORY).exec();
            })
        );

        if (!moviesByCategory) {
            throw {statusCode: 404, message: 'Movies could not be retrieved'};
        }
        
        moviesByCategory.push(watchedMovies)
        return moviesByCategory;
    } catch (err) {
        errorClass.filterError(err);
    }
}

const generateShortId = async () => {
    try {
        const maxIdMovie = await Movie.findOne()
            .sort({ shortId: -1 }) // Sort by shortId in descending order
            .exec();
    
        // Returns 1 more than the max ID, or 0 if no movies exist
        return maxIdMovie ? maxIdMovie.shortId + 1 : 0;
    } catch (err) {
        errorClass.filterError(err);
    }
};

// Convert the categories field from strings to ObjectId
const categoriesStringToId = async (movieData) => {
    try {
        // Find the categories by name
        const categoryIds = await Promise.all(
            movieData.categories.map(async (categoryName) => await categoryService.getCategoryIdByName(categoryName))
        );

        // Replace the names with ObjectIds
        movieData.categories = categoryIds;
    
        return movieData
    } catch (err) {
        errorClass.filterError(err);
    }
}

const createMovie = async (movieData) => {
    try {
        if (movieData.shortId) {
            throw {statusCode: 400, message: 'Do not enter ID'};
        }

        movieData = await categoriesStringToId(movieData);

        const movie = new Movie(movieData);
        
        if (!movie) {
            throw {statusCode: 400, message: 'Movie could not be created'};
        }
        
        movie.shortId = await generateShortId();
        
        return await movie.save();
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getMovieById = async (id) => {
    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            throw {statusCode: 404, message: 'Movie not found'};
        }

        return movie;
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getMovieByShortId = async (shortId) => { 
    try {
        const movie = await Movie.findOne({ shortId });
        if (!movie) {
            throw {statusCode: 404, message: 'Movie not found'};
        }

        return movie;
    } catch (err) {
        errorClass.filterError(err);
    }
};

const replaceMovie = async (id, movieData) => {
    try {
        const movie = await getMovieById(id);
        if (!movie) {
            throw {statusCode: 404, message: 'Movie not found'};
        }

        movieData = await categoriesStringToId(movieData);

        // Check for missing fields (this will throw an error upon a missing field)
        new Movie(movieData);
        
        // Set the new data
        movie.set(movieData);
    
        return await movie.save();
    } catch (err) {
        errorClass.filterError(err);
    }
};

const deleteMovie = async (id) => {
    try {
        const movie = await getMovieById(id);
        if (!movie) {
            throw {statusCode: 404, message: 'Movie not found'};
        }

        
        const users = await User.find({ watchedMovies: id }).exec();
        
        const client = new ClientClass(IP, PORT);
        
        for (const user of users) {
            const response = await client.run(`DELETE ${user.shortId} ${movie.shortId}`);

            if (response !== '204 No Content') {
                const statusCode = parseInt(response.split(' ')[0], 10);
                const message = response.split(' ')[1];
                throw { statusCode: statusCode, message: `${message}: Could not DELETE from recommendation system` };
            }
        }

        client.close();
        
        await User.updateMany (
                    { watchedMovies: id }, // Find the users that have this movie
                    { $pull: { watchedMovies: id } } // Remove them
        );
        
        await movie.deleteOne();
        return movie;
    } catch (err) {
        errorClass.filterError(err);
    }
};

// For POST/PATCH
const runCommand = async (client, user, movie, command, statusCode) => {
    const response = await client.run(`${command} ${user.shortId} ${movie.shortId}`);
    if (response !== statusCode) {
        const statusCode = parseInt(response.split(' ')[0], 10);
        const message = response.split(' ')[1];
        throw { statusCode: statusCode, message: `${message}: Could not execute ${command} in the recommendation system` };
    }
};

const watchMovie = async (userId, movieId) => {
    try {
        const user = await userService.getUserById(userId);
        const movie = await getMovieById(movieId);
        const client = new ClientClass(IP, PORT);
        
        // Add the movie to the user's watched list in the recommendation system
        if (user.hasWatched) {
            runCommand(client, user, movie, "PATCH", "200 Ok");
        } else {
            runCommand(client, user, movie, "POST", "201 Created");
            
            user.hasWatched = true;
            await user.save();
        }

        client.close();

        // Add the movie to the user's watched list in mongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $addToSet: { watchedMovies: movieId } }, // Prevent duplicates
            { new: true } // To return the updated user
        );

        if (!updatedUser) {
            throw { statusCode: 400, message: 'Could not update watched movies list' };
        }
    } catch (err) {
        errorClass.filterError(err);
    }
}

const recommendMovies = async (userId, movieId) => {
    try {
        const user = await userService.getUserById(userId);
        const movie = await getMovieById(movieId);

        const client = new ClientClass(IP, PORT);
        const response = await client.run(`GET ${user.shortId} ${movie.shortId}`);
        client.close();

        statusMessage = response.split('\n\n')[0].trim();
        data = response.split('\n\n')[1].trim();

        if (!response.includes('200 Ok')) {
            const statusCode = parseInt(statusMessage.split(' ')[0], 10);
            const message = statusMessage.split(' ')[1];
            throw { statusCode: statusCode, message: `${message}: Could not GET from recommendation system` };
        }

        const idList = data.split(" ").map(id => parseInt(id, 10)); // Convert to numbers
        const recommendedMovies = [];

        for (const id of idList) {
            recommendedMovies.push(await getMovieByShortId(id));
        }

        return recommendedMovies;
    } catch (err) {
        errorClass.filterError(err);
    }
}

const searchInMovies = async (query) => {
    try {
        const stringRegex = { $regex: query, $options: "i" };

        const movies = await Movie.find({
            $or: [
                { title: stringRegex },
                // Convert numbers to strings:
                { $expr: {
                    $regexMatch: {
                        input: { $toString: "$lengthMinutes" },
                        regex: query,
                        options: "i" // Case insensitive
                    } } },
                { $expr: {
                    $regexMatch: {
                        input: { $toString: "$releaseYear" },
                        regex: query,
                        options: "i"
                    } } }
            ]
        }).exec();

        // Find the categories that contain the query
        const categories = await Category.find({ name: stringRegex }).exec();
        if (!movies || !categories) {
            throw {statusCode: 400, message: 'Invalid query'};
        }

        // No categories match the query
        if (categories.length === 0) {
            return movies;
        }

        const categoryIds = categories.map(category => category._id);

        // Find the movies that have a category that was found
        const categorySearch = await Movie.find({
            categories: { $in: categoryIds }
        }).exec();

        const result = movies.concat(categorySearch);

        // Remove duplicates
        return Array.from(
            new Map(result.map(movie => [movie._id.toString(), movie])).values()
        );
    } catch (err) {
        errorClass.filterError(err);
    }
};

module.exports = { createMovie, getMovieById, getMovieByShortId, getMovies, replaceMovie, deleteMovie, searchInMovies, categoriesStringToId, watchMovie, recommendMovies };