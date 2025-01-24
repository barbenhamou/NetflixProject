const User = require('../models/user');
const userService = require('./user');

const authenticateUser = async (name, password) => {
    try {
        const user = await userService.getUserByName(name);
        if (!user) {
            return null; // Return null if the user does not exist
        }

        if (user.password !== password) {
            return null; // Return null if the password does not match
        }

        return user; // Return the user object if authentication succeeds
    } catch (err) {
        throw {statusCode: 500, message: 'Failed to authenticate user'};
    }
};

module.exports = { authenticateUser };