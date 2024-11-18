const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        if (!/^Bearer /.test(authHeader)) {
            return res.status(401).json({ error: 'Format de token invalide' });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'votre_secret', (err, user) => {
            if (err) return res.status(403).json({ error: 'Token invalide' });
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(500).json({ error: 'Erreur d\'authentification' });
    }
};

module.exports = { authenticateToken }; 