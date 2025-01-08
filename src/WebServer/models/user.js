const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required (enter with no dashes)']
    },
    picture: {
        type: String,
        default: "none",
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },

    
});

module.exports = mongoose.model('User', User);