const Movie = require('../models/movie');
const categoryService = require('./category');
const errorClass = require("../ErrorHandling");

const getMovies = async () => {
    try {
        return await Movie.find({}).exec();
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
        movie.shortId = await generateShortId();
        return await movie.save();
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getMovieById = async (id) => {
    try {
        return await Movie.findById(id).populate('categories').exec();
    } catch (err) {
        errorClass.filterError(err);
    }
};

const replaceMovie = async (id, movieData) => {
    try {
        const movie = await getMovieById(id);
        if (!movie) return null;
        
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
        if (!movie) return null;

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
                { categories: stringRegex },
                // Convert numbers to strings:
                { $expr: {
                    $regexMatch: {
                        input: { $toString: "$lengthMinutes" },
                        regex: query,
                        options: "i"
                    } } },
                { $expr: {
                    $regexMatch: {
                        input: { $toString: "$releaseYear" },
                        regex: query,
                        options: "i"
                    } } }
            ]
        }).exec();

        return movies;
    } catch (err) {
        errorClass.filterError(err);
    }
};

module.exports = { createMovie, getMovieById, getMovies, replaceMovie, deleteMovie, searchInMovies };