const express = require('express');
const router = express.Router();

const tokenController = require('../controllers/token');

router.route('/')
    .post(tokenController.authenticateUser);

module.exports = router;