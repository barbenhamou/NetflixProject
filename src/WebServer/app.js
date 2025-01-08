const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const movies = require('./routes/movie');
const categories = require('./routes/category');

require('custom-env').env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING);

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());

app.use('/api/movies', movies);
app.use('/api/categories', categories);

app.listen(process.env.PORT);