const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required']
    },
    promoted: {
        type: Boolean,
        required: [true, 'Promoted field is required']
    }
});

module.exports = mongoose.model('Category', Category);