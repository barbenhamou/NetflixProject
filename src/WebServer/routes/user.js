const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/api/users', userController.createUser); // Create a new user
router.post('/api/tokens', userController.authenticateUser); // Authenticate user

module.exports = router;