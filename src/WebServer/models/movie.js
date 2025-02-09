const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movie = new Schema({
    title : {
        type: String,
        required: [true, 'Title is required']
    },
    // An array of the movie's Categories, saved as IDs (category names can be changed):
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: []
    }],
    lengthMinutes: {
        type: Number,
        min: [0, "Length must be a positive number"],
        required: [true, 'Length (in minutes) is required']
    },
    releaseYear: {
        type: Number,
        default: new Date().getFullYear(), // Defaults to the current year
        validate: {
            validator: Number.isInteger, // Ensures it is an integer
            message: 'Release year must be a whole number'
        }
    },
    cast: [{
        type: String,
        default: []
    }],
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        required: [true, 'The image field is required (path to the image file)']
    },
    trailer: {
        type: String,
        required: [true, 'The trailer field is required (path to the trailer file)']
    },
    film: {
        type: String,
        required: [true, 'The film field is required (path to the movie file)']
    },
    shortId: { // For the recommendation system (_id is too large)
        type: Number,
    }
});

module.exports = mongoose.model('Movie', Movie);