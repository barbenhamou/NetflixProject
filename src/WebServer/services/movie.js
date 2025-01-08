const Movie = require('../models/movie');
const Category = require('../models/category');
const categoryService = require('./category');
const errorClass = require("../ErrorHandling");

const getMovies = async () => {
    try {
        const movies = await Movie.find({});
        if (!movies) {
            throw {statusCode: 404, message: 'Movies could not be retrieved'};
        }

        return movies;
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

const createMovie = async (movieData) => {
    try {
        if (movieData.categories) {
            // Find the categories by name
            const categoryIds = await Promise.all(
                movieData.categories.map(async (categoryName) => await categoryService.getCategoryIdByName(categoryName))
            );

            // Replace the names with ObjectIds
            movieData.categories = categoryIds;
        }

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

module.exports = { createMovie, getMovieById, getMovies, replaceMovie, deleteMovie, searchInMovies };