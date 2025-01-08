const userService = require('../services/user');

const createUser = async (req, res) => {
    const { name, password, email, phone, picture, location } = req.body;

    // Validate input fields
    if (!name || !password || !email || !phone || !location) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if a user already exists with the same email
        const existingEmailUser = await userService.getUserByEmail(email);

        if (existingEmailUser) {
            return res.status(400).json({ message: "A user with this email already exists." });
        }

        // Create a new user
        const newUser = await userService.createUser({ name, password, email, phone, picture, location });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error in createUser controller:", error);
        res.status(500).json({ message: "Error creating user.", error: error.message });
    }
};


const authenticateUser = async (req, res) => {
    const { name, password } = req.body;

    try {
        // Call the service to authenticate the user
        const user = await userService.authenticateUser(name, password);
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Respond with the user ID
        res.json({ userId: user._id });
    } catch (error) {
        console.error("Error in authenticateUser controller:", error);
        res.status(500).json({ message: "Error authenticating user." });
    }
};

module.exports = {
    createUser,
    authenticateUser,
};
