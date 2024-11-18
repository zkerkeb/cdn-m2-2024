const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simuler une base de données utilisateurs (à remplacer par une vraie BD)
const users = [
    { id: 1, username: 'admin', password: 'admin123' }
];

/**
 * Route de login pour générer un token JWT
 */
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation des entrées
        if (!username || !password) {
            return res.status(400).json({ error: 'Username et password requis' });
        }

        // Vérification des credentials
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return res.status(401).json({ error: 'Credentials invalides' });
        }

        // Génération du token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'votre_secret',
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur lors de l\'authentification' });
    }
});

module.exports = router; 