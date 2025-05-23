const movieService = require('../services/movie');
const contentService = require('../services/content');

// Only show relevant info
const presentMovie = async (movie) => {
    try {
        // Turn the category IDs into actual category documents
        await movie.populate('categories');
        const movieId = movie._id;

        const { file } = await contentService.getMovieFiles(movieId.toString(), 'image', 0);

        return {
            id: movieId,
            title: movie.title,
            categories: movie.categories.map(category => category.name),
            lengthMinutes: movie.lengthMinutes,
            releaseYear: movie.releaseYear,
            cast: movie.cast,
            image: movie.image,
            trailer: movie.trailer,
            film: movie.film,
            description: movie.description,
            imageFile: file.toString('base64')
        };
    } catch (err) {
        throw { statusCode: 500, message: (err.message || 'Error displaying movie') };
    }
};

const getMovies = async (req, res) => {
    try {
        const moviesLists = await movieService.getMovies(req.token);
        
        res.json(
            await Promise.all(
                moviesLists.map(async (moviesList) => {
                    return [
                        moviesList[0],
                        await Promise.all(moviesList[1].map((movie) => presentMovie(movie)))
                    ];
                })
            )
        );
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const createMovie = async (req, res) => {
    try {
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
            throw { statusCode: 404, message: 'Movie could not be replced' };

        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        if (!(await movieService.deleteMovie(req.params.id)))
            throw { statusCode: 404, message: 'Movie could not be deleted' };

        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const recommendMovies = async (req, res) => {
    try {
        const recommendation = await movieService.recommendMovies(req.token, req.params.id);
        res.json(await Promise.all(recommendation.map((movie) => presentMovie(movie))));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }

};

const watchMovie = async (req, res) => {
    try {
        await movieService.watchMovie(req.token, req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const searchInMovies = async (req, res) => {
    try {
        const movies = await movieService.searchInMovies(req.params.query);
        res.json(await Promise.all(movies.map((movie) => presentMovie(movie))));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

module.exports = {
    getMovies, createMovie, getMovie, replaceMovie, deleteMovie, recommendMovies, watchMovie, searchInMovies, presentMovie
};