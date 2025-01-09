const movieService = require('../services/movie');

// Only show relevant info
const presentMovie = async (movie) => {
    try {
        await movie.populate('categories');
        await movie.save();
        return {
            id: movie._id,
            title: movie.title,
            categories: movie.categories.map(category => category.name),
            lengthMinutes: movie.lengthMinutes,
            releaseYear: movie.releaseYear
        };
    } catch (err) {
        res.status(500).json({ error: 'Error displaying movie' });
    }
};

const getMovies = async (req, res) => {
    try {
        const movies = await movieService.getMovies();
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
        res.status(201).set('Location', `/api/movies/${movie._id}`).end();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const getMovie = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);

        res.json(await presentMovie(movie));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const replaceMovie = async (req, res) => {
    try {
        if (!await movieService.replaceMovie(req.params.id, req.body))
            throw {statusCode: 404, message: 'Movie could not be replced'};
    
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        if (!await movieService.deleteMovie(req.params.id))
            throw {statusCode: 404, message: 'Movie could not be deleted'};
    
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

        res.json(await Promise.all(movies.map(async (movie) => await presentMovie(movie))));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

module.exports = {
    getMovies, createMovie, getMovie, replaceMovie, deleteMovie, recommendMovies, watchMovie, searchInMovies, presentMovie
};