/**
 * Middleware pour le monitoring des requêtes HTTP
 * Enregistre les métriques importantes de chaque requête
 */
const logger = require('../config/logger');

const requestMonitoring = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent')
        }, 'Requête HTTP traitée');
    });

    next();
};

module.exports = requestMonitoring; 