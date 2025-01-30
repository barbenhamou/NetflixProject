const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movie');
const tokenVerifier = require('../TokenVerifier');

router.route('/')
    .get(tokenVerifier.tokenValidation(false), movieController.getMovies)
    .post(tokenVerifier.tokenValidation(true), movieController.createMovie);

router.route('/:id')
    .get(movieController.getMovie)
    .put(tokenVerifier.tokenValidation(true), movieController.replaceMovie)
    .delete(tokenVerifier.tokenValidation(true), movieController.deleteMovie);

router.route('/:id/recommend')
    .get(tokenVerifier.tokenValidation(false), movieController.recommendMovies)
    .post(tokenVerifier.tokenValidation(false), movieController.watchMovie)

router.route('/search/:query')
    .get(movieController.searchInMovies)

router.route('/:id/files')
    .get(movieController.getMovieFiles)
    .post(tokenVerifier.tokenValidation(true), movieController.uploadMovieFile)
//tokenVerifier.tokenValidation(false), 
module.exports = router;