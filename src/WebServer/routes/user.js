const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/users', userController.createUser); // Create a new user
router.post('/tokens', userController.authenticateUser); // Authenticate user

module.exports = router;