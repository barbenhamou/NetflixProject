const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.route('/')
    .post(userController.createUser);
    
router.route('/')
    .get(userController.getUser);

module.exports = router;