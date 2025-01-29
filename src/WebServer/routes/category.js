const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category');
const tokenVerifier = require('../TokenVerifier');

router.route('/')
    .get(categoryController.getCategories)
    .post(tokenVerifier.tokenValidation(true), categoryController.createCategory);

router.route('/:id')
    .get(categoryController.getCategory)
    .patch(tokenVerifier.tokenValidation(true), categoryController.updateCategory)
    .delete(tokenVerifier.tokenValidation(true), categoryController.deleteCategory);

module.exports = router;