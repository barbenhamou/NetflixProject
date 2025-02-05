const express = require('express');
const router = express.Router();
const fileController = require('../controllers/files');
const tokenVerifier = require('../TokenVerifier');

const uploadMulter = fileController.createMulterForMovie().fields([
    { name: 'film', maxCount: 1 },
    { name: 'trailer', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

router.route('/:id/files')
    .post(tokenVerifier.tokenValidation(true), uploadMulter, fileController.handleFileUpload);

module.exports = router;
