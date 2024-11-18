const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const logger = require('../config/logger');

async function generateOptimizedVersions(filePath) {
    logger.info('🎨 Début de l\'optimisation des images');

    // 1. CONFIGURATION
    const sizes = {
        '200': 200,
        '400': 400,
        '800': 800
    };

    const formats = {
        jpeg: { quality: 80, mozjpeg: true },
        webp: { quality: 80 }
    };

    try {
        // 2. VÉRIFICATIONS PRÉLIMINAIRES
        await fs.access(filePath);
        const outputDir = 'uploads/optimized';
        await fs.mkdir(outputDir, { recursive: true });

        logger.debug({
            sizes: Object.keys(sizes),
            formats: Object.keys(formats)
        }, '⚙️ Configuration de l\'optimisation');

        // 3. TRAITEMENT DES IMAGES
        const resultats = await Promise.all(
            Object.entries(sizes).flatMap(async ([nomTaille, taille]) => {
                return await Promise.all(
                    Object.entries(formats).map(async ([format, options]) => {
                        const nomFichier = path.basename(filePath, path.extname(filePath));
                        const cheminSortie = path.join(outputDir, `${nomFichier}_${nomTaille}.${format}`);

                        try {
                            const resultat = await sharp(filePath)
                                .resize(taille, taille, { fit: 'inside', withoutEnlargement: true })
                                .toFormat(format, options)
                                .toFile(cheminSortie);

                            logger.debug({
                                size: nomTaille,
                                format: format,
                                path: cheminSortie
                            }, '✨ Version optimisée générée');

                            return {
                                taille: nomTaille,
                                format: format,
                                chemin: cheminSortie,
                                largeur: resultat.width,
                                hauteur: resultat.height
                            };
                        } catch (erreur) {
                            logger.error({
                                error: erreur.message,
                                size: nomTaille,
                                format: format
                            }, '❌ Échec de génération d\'une version');
                            return null;
                        }
                    })
                );
            })
        );

        // Filtrer les résultats null
        const versions = resultats.flat().filter(Boolean);

        logger.info({
            versionsCount: versions.length
        }, '✅ Optimisation terminée avec succès');

        // 4. RETOUR DES RÉSULTATS
        return {
            succes: true,
            nombreVersions: versions.length,
            versions: versions
        };

    } catch (erreur) {
        logger.error({
            error: erreur.message,
            stack: erreur.stack
        }, '💥 Erreur fatale lors de l\'optimisation');
        throw new Error('Échec de l\'optimisation de l\'image');
    }
} 

module.exports = { generateOptimizedVersions };