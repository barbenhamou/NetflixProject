const tokenValidating = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    req.token = token;
    next();
};

module.exports = { tokenValidating };