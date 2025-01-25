const mongoose = require('mongoose');
const User = require('../models/user');
const errorClass = require("../ErrorHandling");

const generateShortId = async () => {
    try {
        const maxIdUser = await User.findOne()
            .sort({ shortId: -1 }) // Sort by shortId in descending order
            .exec();
    
        // Returns 1 more than the max ID, or 0 if no movies exist
        return maxIdUser ? maxIdUser.shortId + 1 : 0;
    } catch (err) {
        errorClass.filterError(err);
    }
};

const createUser = async (userData) => {
    try {
        if (userData.shortId) {
            throw {statusCode: 400, message: 'Do not enter ID'};
        }

        const user = new User(userData);
        if (!user) {
            throw {statusCode: 400, message: 'User could not be created'};
        }

        user.shortId = await generateShortId();

        return await user.save();
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getUserById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw {statusCode: 404, message: 'User not found'};
        }

        const user = await User.findById(id);
        if (!user) {
            throw {statusCode: 404, message: 'User not found'};
        }

        return user;
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user; // Return the user directly or null if not found
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getUserByName = async (username) => {
    try {
        const user = await User.findOne({ username });

        return user;
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getUserByPhone = async (phone) => {
    try {
        const user = await User.findOne({ phone });
        if (!user) {
            throw {statusCode: 404, message: 'User not found'};
        }
        
        return user;
    } catch (err) {
        errorClass.filterError(err);
    }
};

module.exports = { createUser, getUserByEmail, getUserByName, getUserByPhone, getUserById };