// Importation des modules nécessaires
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const swagger = require('./swagger');
const authRoutes = require('./routes/auth');
const logger = require('./config/logger');
// Importation du middleware de monitoring
const requestMonitoring = require('./middlewares/monitoring');

// Importation du rate limiter
const apiLimiter = require('./config/rateLimit');

// Importation de la configuration CORS
const corsConfig = require('./config/corsConfig');

// Importation du middleware pour forcer HTTPS
const forceHttps = require('./middlewares/forceHttps');



const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(forceHttps);
}
// Middleware pour logger chaque requête
app.use(requestMonitoring);

 
// Route pour accéder à la spécification OpenAPI en JSON
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger.spec);
});

// Configuration des middlewares de sécurité 
app.use(helmet()); // Ajoute des en-têtes de sécurité
app.use('/api-docs', swagger.serve, swagger.setup);

app.use(cors(corsConfig));
app.use(express.json({ limit: '10mb' }));

// Application du rate limiting
app.use('/api/', apiLimiter);

// ========== CONFIGURATION DU STOCKAGE SÉCURISÉ ==========

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/upload', uploadRoutes);

const imageRoutes = require('./routes/imageRoutes');
app.use('/image', imageRoutes);

// ========== MONITORING ET LOGS ==========

// Utilisation du middleware


app.use('/image', express.static(path.join(__dirname, 'uploads')));
app.use('/image', express.static(path.join(__dirname, 'uploads/optimized')));
// Utilisation des routes d'authentification
app.use('/api', authRoutes);

// Démarrage sécurisé du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`CDN sécurisé démarré sur le port ${port}`);
    logger.info('Configuration de sécurité active:');
    logger.info('- HTTPS forcé en production');
    logger.info('- Rate limiting activé');
    logger.info('- Validation des entrées');
    logger.info('- Authentification JWT');
    logger.info('- Monitoring actif');
})