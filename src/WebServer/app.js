const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const categories = require('./routes/category');
const users = require('./routes/user'); // Import the users route
require('custom-env').env(process.env.NODE_ENV, './config');

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING);

require('custom-env').env('local', './config'); // Explicitly specify the environment and path

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/category', categories);

// Start the server
app.listen(process.env.PORT);