const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movie = new Schema({
    title : {
        type: String,
        required: [true, 'Movie title is required.']
    },
    categories: {
        type: [String], // Categories must exist
        required: [true, 'You must enter the movie\'s categories.']
    },
    lengthMinutes: {
        type: Number,
        required: [true, 'Movie length (in minutes) is required.']
    },
    releaseYear: {
        type: Number,
        default: new Date().getFullYear() // Defaults to the current year
    },
    shortId: { // For the movie system (_id is too large)
        type: Number, 
    }
});

module.exports = mongoose.model('Movie', Movie);