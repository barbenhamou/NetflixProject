const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const tokenVerifier = require('../TokenVerifier');

router
    .route('/')
    .get(categoryController.getCategories)
    .post(tokenVerifier.tokenValidating, categoryController.createCategory);

router
    .route('/:id')
    .get(categoryController.getCategory)
    .patch(tokenVerifier.tokenValidating, categoryController.updateCategory)
    .delete(tokenVerifier.tokenValidating, categoryController.deleteCategory);

module.exports = router;