const express = require('express');
const router = express.Router();
const upload = require('../config/uploadConfig');
const { authenticateToken } = require('../middlewares/auth');
const { generateOptimizedVersions } = require('../services/optimizedImageService');
const logger = require('../config/logger');

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    logger.info('📤 Début du processus d\'upload');
    
    try {
        if (!req.file) {
            logger.error('❌ Aucun fichier n\'a été envoyé');
            return res.status(400).json({ error: 'Aucun fichier n\'a été envoyé' });
        }

        logger.info({
            filename: req.file.originalname,
            size: req.file.size,
            user: req.user.username
        }, '📁 Fichier reçu et en cours de traitement');

        await generateOptimizedVersions(req.file.path);
        
        logger.info({
            filename: req.file.filename,
            user: req.user.username
        }, '✅ Upload et optimisation réussis');

        res.status(200).json({
            success: true,
            filename: req.file.filename
        });
    } catch (error) {
        logger.error({
            error: error.message,
            stack: error.stack,
            user: req.user?.username
        }, '💥 Erreur lors du traitement du fichier');
        
        res.status(500).json({ error: 'Erreur lors du traitement' });
    }
});

module.exports = router;

// ... dans cdn/index.js, remplacez la route d'upload par ...
// const uploadRoutes = require('./routes/uploadRoutes');
// app.use('/api', uploadRoutes); 