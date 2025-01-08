const express = require('express');
var router = express.Router();

const tokenVerifier = require('../TokenVerifier');
const movieController = require('../controllers/movie');

router.route('/')
    .get(movieController.getMovies)
    .post(movieController.createMovie);

router.route('/:id')
    .get(movieController.getMovie)
    .put(movieController.replaceMovie)
    .delete(movieController.deleteMovie);

router.route('/:id/recommend')
    .get(movieController.recommendMovies)
    .post(movieController.watchMovie)

router.route('/search/:query')
    .get(movieController.searchInMovies)

module.exports = router;