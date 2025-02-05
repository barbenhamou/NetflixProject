const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file');
const tokenVerifier = require('../TokenVerifier');

const uploadMulter = fileController.createMulterForMovie().fields([
    { name: 'film', maxCount: 1 },
    { name: 'trailer', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

router.route('/:id/files')
    .post(uploadMulter, fileController.handleFileUpload, tokenVerifier.tokenValidation(true));

module.exports = router;
