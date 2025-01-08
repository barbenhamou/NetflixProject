const movieService = require('../services/movie');

// Only show relevant info
const presentMovie = (movie) => {
    return {
        title: movie.title,
        categories: movie.categories,
        lengthMinutes: movie.lengthMinutes,
        releaseYear: movie.releaseYear
    };
};

const getMovies = async (req, res) => {
    try {
        const movies = await movieService.getMovies();
        if (!movies) {
            return res.status(400).json({ error: 'Movies could not be retrieved' });
        }
        res.json(movies.map(presentMovie));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const createMovie = async (req, res) => {
    try {
        if (req.body.shortId) {
            return res.status(400).json({ error: 'Do not enter the ID' });
        }
        const movie = await movieService.createMovie(req.body);
        if (!movie) {
            return res.status(400).json({ error: 'Movie could not be created' });
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
            return res.status(404).json({ error: 'Movie not found' });
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
            return res.status(404).json({ error: 'Movie not found or could not be replced' });
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
            return res.status(404).json({ error: 'Movie not found or could not be deleted' });
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
            return res.status(404).json({ error: 'No movies match the query' });
        }

        res.json(movies.map(presentMovie));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

module.exports = {
    getMovies, createMovie, getMovie, replaceMovie, deleteMovie, recommendMovies, watchMovie, searchInMovies
};