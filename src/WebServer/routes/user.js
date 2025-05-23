const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.route('/')
    .post(userController.createUser);
    
router.route('/:id')
    .get(userController.getUser);

module.exports = router;