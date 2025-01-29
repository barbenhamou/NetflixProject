const userService = require('./user');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const authenticateUser = async (username, password) => {
    try {
        const user = await userService.getUserByName(username);
        if (!user) {
            return null; // Return null if the user does not exist
        }

        if (user.password !== password) {
            return null; // Return null if the password does not match
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, secret);

        return { userId: user._id, token: token }; // Return the user token + id if authentication succeeds
    } catch (err) {
        throw {statusCode: 500, message: 'Failed to authenticate user'};
    }
};

module.exports = { authenticateUser };