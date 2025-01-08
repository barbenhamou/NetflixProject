const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category');
const tokenVerifier = require('../TokenVerifier');

router.route('/')
    .get(categoryController.getCategories)
    .post(tokenVerifier.tokenValidation, categoryController.createCategory);

router.route('/:id')
    .get(categoryController.getCategory)
    .patch(tokenVerifier.tokenValidation, categoryController.updateCategory)
    .delete(tokenVerifier.tokenValidation, categoryController.deleteCategory);

module.exports = router;