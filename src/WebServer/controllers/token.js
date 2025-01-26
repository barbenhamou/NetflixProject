const tokenService = require('../services/token');

const authenticateUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Call the service to authenticate the user
        const token = await tokenService.authenticateUser(username, password);
        
        if (!token) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Respond with the token
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Error authenticating user" });
    }
};

module.exports = { authenticateUser };
