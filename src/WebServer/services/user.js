const User = require('../models/user');

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const getUserByName = async (name) => {
    return await User.findOne({ name });
};

const getUserByPhone = async (phone) => {
    return await User.findOne({ phone });
};

const authenticateUser = async (name, password) => {
    return await User.findOne({ name, password });
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserByName,
    getUserByPhone,
    authenticateUser,
};
