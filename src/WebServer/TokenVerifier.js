const userService  = require('./services/user');
const jwt = require('jsonwebtoken');

const key = "secret";

const tokenValidation = (adminActionBool) => {
    return (req, res, next) => {
        if (!req.headers['authorization']) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        try {
            const decodedToken = jwt.verify(token, key);
            
            if (adminActionBool && decodedToken.username !== 'admin') {
                return res.status(401).json({ error: 'Access denied: Admins only' });
            }

            req.token = decodedToken;

            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token is invalid' });
        }
    };
};

module.exports = { tokenValidation };