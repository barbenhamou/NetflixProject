const Movie = require('../models/movie');
const User = require('../models/user');
const Category = require('../models/category');
const categoryService = require('./category');
const userService = require('./user');
const errorClass = require("../ErrorHandling");

const getMovies = async (userId) => {
    const MOVIES_PER_CATEGORY = 20

    try {
        // Get the user's watched movies
        const user = await userService.getUserById(userId);
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }
        const watchedMovieIds = user.watchedMovies;

        // Get up to `MOVIES_PER_CATEGORY` movies the user has watched
        const watchedMovies = await Movie.find({
            _id: { $in: watchedMovieIds } // Include only watched movies
        }).limit(MOVIES_PER_CATEGORY).exec();

        // Get all promoted categories
        const promotedCategories = await Category.find({ promoted: true }).exec();

        if (!promotedCategories || promotedCategories.length === 0) {
            // No promoted categories, return just the watched movies
            return watchedMovies;
        }

        // Get up to `MOVIES_PER_CATEGORY` unwatched movies of each promoted category
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

        // Make into one big array
        return moviesByCategory.flat().concat(watchedMovies); // TODO: change to list of lists?
    } catch (err) {
        errorClass.filterError(err);
    }
};

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

        // TODO: also delete from recommendation system
        
        await movie.deleteOne();
        return movie;
    } catch (err) {
        errorClass.filterError(err);
    }
};

const watchMovie = async (userId, movieId) => {
    try {
        // Add the movie to the user's watched list in the recommendation system
        const user = userService.getUserById(userId);
    
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

module.exports = { createMovie, getMovieById, getMovies, replaceMovie, deleteMovie, searchInMovies, categoriesStringToId, watchMovie };