const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Configuration des tailles d'images
 */
const SIZES = {
    '200': 200,    // Pour les vignettes
    '400': 400,    // Pour l'affichage standard
    '800': 800     // Pour l'affichage plein écran
};

/**
 * Configuration des formats d'export
 */
const FORMATS = {
    jpeg: {
        quality: 80,
        mozjpeg: true
    },
    webp: {
        quality: 80
    }
};

/**
 * Génère différentes versions optimisées d'une image
 * @param {string} filePath - Chemin vers le fichier image original
 * @returns {Promise<Object>} - Résultat de l'optimisation
 */
async function generateOptimizedVersions(filePath) {
    try {
        await fs.access(filePath);
        const outputDir = 'uploads/optimized';
        await fs.mkdir(outputDir, { recursive: true });

        const resultats = await Promise.all(
            Object.entries(SIZES).flatMap(([nomTaille, taille]) =>
                Object.entries(FORMATS).map(([format, options]) =>
                    processImage(filePath, outputDir, nomTaille, taille, format, options)
                )
            )
        );

        return {
            succes: true,
            nombreVersions: resultats.filter(Boolean).length,
            versions: resultats.filter(Boolean)
        };

    } catch (erreur) {
        console.error('Erreur lors de l\'optimisation:', erreur.message);
        throw new Error('Échec de l\'optimisation de l\'image');
    }
}

/**
 * Traite une seule version d'image
 * @private
 */
async function processImage(filePath, outputDir, nomTaille, taille, format, options) {
    try {
        const nomFichier = path.basename(filePath, path.extname(filePath));
        const cheminSortie = path.join(outputDir, `${nomFichier}_${nomTaille}.${format}`);

        const resultat = await sharp(filePath)
            .resize(taille, taille, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFormat(format, options)
            .toFile(cheminSortie);

        console.log(`✓ Image générée : ${path.basename(cheminSortie)}`);

        return {
            taille: nomTaille,
            format,
            chemin: cheminSortie,
            largeur: resultat.width,
            hauteur: resultat.height
        };

    } catch (erreur) {
        console.error(`Erreur pour ${nomTaille} en ${format}:`, erreur.message);
        return null;
    }
}

module.exports = {
    generateOptimizedVersions
}; 