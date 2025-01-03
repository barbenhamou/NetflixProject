const users = require('../services/user');

const createUser = async (req, res) => {
    const { name, password, email, phone, picture } = req.body;

    // Validate input fields
    if (!name || !password || !email || !phone) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if a user already exists with the same email
        const existingEmailUser = await users.getUserByEmail(email);
        if (existingEmailUser) {
            return res.status(400).json({ message: "A user with this email already exists." });
        }

        // Check if a user already exists with the same name
        const existingNameUser = await users.getUserByName(name);
        if (existingNameUser) {
            return res.status(400).json({ message: "A user with this name already exists." });
        }

        // Check if a user already exists with the same phone number
        const existingPhoneUser = await users.getUserByPhone(phone);
        if (existingPhoneUser) {
            return res.status(400).json({ message: "A user with this phone number already exists." });
        }

        // Create a new user
        const newUser = await users.createUser({ name, password, email, phone, picture });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error in createUser controller:", error);
        res.status(500).send("Error creating user: " + error.message);
    }
};


const authenticateUser = async (req, res) => {
    const { name, password } = req.body;

    try {
        // Check if the user exists by name and password
        const user = await users.authenticateUser(name, password);
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Return user ID
        res.json({ userId: user._id });
    } catch (error) {
        res.status(500).send("Error authenticating user: " + error.message);
    }
};

module.exports = {
    createUser,
    authenticateUser,
};
