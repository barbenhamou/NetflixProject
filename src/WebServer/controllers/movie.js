const movieService = require('../services/movie');

// Only show relevant info
const presentMovie = async (movie) => {
    await movie.populate('categories');
    
    return {
        id: movie._id,
        title: movie.title,
        categories: movie.categories.map(category => category.name),
        lengthMinutes: movie.lengthMinutes,
        releaseYear: movie.releaseYear
    };
};

const getMovies = async (req, res) => {
    try {
        const movies = await movieService.getMovies();
        if (!movies) {
            throw {statusCode: 404, message: 'Movies could not be retrieved'};
        }
        
        res.json(await Promise.all(movies.map(async (movie) => await presentMovie(movie))));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const createMovie = async (req, res) => {
    try {
        if (req.body.shortId) {
            throw {statusCode: 400, message: 'Do not enter ID'};
        }
        const movie = await movieService.createMovie(req.body);
        if (!movie) {
            throw {statusCode: 400, message: 'Movie could not be created'};
        }
        res.status(201).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const getMovie = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if (!movie) {
            throw {statusCode: 404, message: 'Movie not found'};
        }

        res.json(presentMovie(movie));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const replaceMovie = async (req, res) => {
    try {
        const replacedMovie = await movieService.replaceMovie(req.params.id, req.body);
        if (!replacedMovie) {
            throw {statusCode: 404, message: 'Movie not found or could not be replced'};
        }
    
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await movieService.deleteMovie(req.params.id);
        if (!deletedMovie) {
            throw {statusCode: 404, message: 'Movie not found or could not be deleted'};
        }
    
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const recommendMovies = async (req, res) => {
    //
};

const watchMovie = async (req, res) => {
    //
};

const searchInMovies = async (req, res) => {
    try {
        const movies = await movieService.searchInMovies(req.params.query);
        if (!movies) {
            throw {statusCode: 404, message: 'No movies match the query'};
        }

        res.json(movies.map(presentMovie));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

module.exports = {
    getMovies, createMovie, getMovie, replaceMovie, deleteMovie, recommendMovies, watchMovie, searchInMovies
};