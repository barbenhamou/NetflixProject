const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content');
const tokenVerifier = require('../TokenVerifier');
const user = require('../models/user');

const movieMulter = contentController.createMulterForMovie().fields([
    { name: 'film', maxCount: 1 },
    { name: 'trailer', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

const userMulter = contentController.createMulterForUser().single('profilePicture');

router.route('/movies/:id/files')
    .post(tokenVerifier.tokenValidation(true), movieMulter, contentController.handleFileUpload);

router.route('/users/:name')
    .post(userMulter, contentController.handleFileUpload);

module.exports = router;
