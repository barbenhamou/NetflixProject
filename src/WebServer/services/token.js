const User = require('../models/user');

const authenticateUser = async (name, password) => {
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return null; // Return null if the user does not exist
        }

        if (user.password !== password) {
            return null; // Return null if the password does not match
        }

        return user; // Return the user object if authentication succeeds
    } catch (error) {
        throw {statusCode: 500, message: 'Failed to authenticate user'};
    }
};

module.exports = { authenticateUser };