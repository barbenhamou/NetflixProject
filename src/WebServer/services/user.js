const User = require('../models/user');
const errorClass = require("../ErrorHandling");

const createUser = async (userData) => {
    try {
        const user = new User(userData);
        if (!user) {
            throw {statusCode: 400, message: 'User could not be created'};
        }

        return await user.save();
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getUserById = async (id) => {
    try {
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

const getUserByName = async (name) => {
    try {
        const user = await User.findOne({ name });
        if (!user) {
            throw {statusCode: 404, message: 'User not found'};
        }

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
