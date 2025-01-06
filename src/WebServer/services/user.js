const User = require('../models/user');

const createUser = async (userData) => {
    try {
        const user = new User(userData);
        const savedUser = await user.save();
        return { data: savedUser }; // Success case
    } catch (error) {
        return { error: "Failed to create user." }; // Error case
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user; // Return the user directly (null if not found)
    } catch (error) {
        console.error("Error in getUserByEmail service:", error);
        throw new Error("Failed to retrieve user by email."); // Throw the error to be handled in the controller
    }
};
const getUserByName = async (name) => {
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return { error: "User with this name does not exist." };
        }
        return { data: user };
    } catch (error) {
        return { error: "Failed to retrieve user by name." };
    }
};

const getUserByPhone = async (phone) => {
    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return { error: "User with this phone number does not exist." };
        }
        return { data: user };
    } catch (error) {
        return { error: "Failed to retrieve user by phone." };
    }
};

const authenticateUser = async (name, password) => {
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return null; // Return null if the user does not exist
        }

        // Replace this with a secure password comparison if passwords are hashed
        if (user.password !== password) {
            return null; // Return null if the password does not match
        }

        return user; // Return the user object if authentication succeeds
    } catch (error) {
        console.error("Error in authenticateUser service:", error);
        throw new Error("Failed to authenticate user.");
    }
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserByName,
    getUserByPhone,
    authenticateUser,
};
