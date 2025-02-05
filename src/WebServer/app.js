const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const tokens = require('./routes/token');
const users = require('./routes/user');
const movies = require('./routes/movie');
const categories = require('./routes/category');
const contents = require('./routes/content');
require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING);

const app = express();
app.use('/api/files', cors(), contents);

app.use(cors({ 
    exposedHeaders: ["Location"] // Allow frontend to access the Location header
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json({ limit: "50mb" }));
app.use('/api/tokens', tokens);
app.use('/api/users', users);
app.use('/api/movies', movies);
app.use('/api/categories', categories);
app.listen(process.env.WEB_PORT);
