const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');
const tokenVerifier = require('../TokenVerifier');

router.route('/')
    .get(tokenVerifier.tokenValidation, movieController.getMovies)
    .post(tokenVerifier.tokenValidation, movieController.createMovie);

router.route('/:id')
    .get(movieController.getMovie)
    .put(tokenVerifier.tokenValidation, movieController.replaceMovie)
    .delete(tokenVerifier.tokenValidation, movieController.deleteMovie);

router.route('/:id/recommend')
    .get(tokenVerifier.tokenValidation, movieController.recommendMovies)
    .post(tokenVerifier.tokenValidation, movieController.watchMovie)

router.route('/search/:query')
    .get(movieController.searchInMovies)

router.route('/:id/files')
    .get(movieController.getMovieFiles)

module.exports = router;