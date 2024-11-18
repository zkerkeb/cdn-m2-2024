const express = require('express');
const router = express.Router();
const { getImagePath, setImageHeaders } = require('../services/imageService');
const cacheMiddleware = require('../middlewares/cacheMiddleware');
const logger = require('../config/logger');

router.get('/:filename', cacheMiddleware(24 * 60 * 60 * 1000), async (req, res) => {
    logger.debug({
        filename: req.params.filename,
        ip: req.ip
    }, '🔍 Tentative d\'accès à une image');

    try {
        const imagePath = await getImagePath(req.params.filename);
        
        if (!imagePath) {
            logger.warn({
                filename: req.params.filename,
                ip: req.ip
            }, '⚠️ Image non trouvée');
            return res.status(404).json({ error: 'Image non trouvée' });
        }

        logger.info({
            filename: req.params.filename,
            path: imagePath
        }, '📤 Image trouvée et envoyée');

        setImageHeaders(res);
        res.sendFile(imagePath);
    } catch (error) {
        logger.error({
            error: error.message,
            filename: req.params.filename,
            ip: req.ip
        }, '💥 Erreur lors de l\'accès à l\'image');
        
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router; 