const userService = require('../services/user');

// Only show relevant and public info (not password)
const presentUser = async (user) => {
    try {
        return {
            username: user.username,
            password: user.password,
            email: user.email,
            phone: user.phone,
            picture: user.picture,
            location: user.location,
        }
    } catch(err) {
        res.status(500).json({ error: 'Error displaying movie' });
    }
}

const createUser = async (req, res) => {
    try {
        // Check if a user already exists with the same email
        const existingUserName = await userService.getUserByName(req.body.username);

        if (existingUserName) {
            return res.status(400).json({ error: "A user with this username already exists" });
        }

        // Create a new user
        const newUser = await userService.createUser(req.body);
        res.status(201).set('Location', `/api/users/${newUser._id}`).end();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        res.json(await presentUser(user));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
}

module.exports = { createUser, getUser, presentUser };