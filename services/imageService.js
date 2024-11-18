const path = require('path');
const fs = require('fs').promises;

/**
 * Vérifie si un fichier existe
 * @param {string} path - Chemin du fichier
 * @returns {Promise<boolean>}
 */
async function fileExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

/**
 * Récupère le chemin d'une image en cherchant d'abord dans le dossier optimized,
 * puis dans le dossier uploads
 * @param {string} filename - Nom du fichier
 * @returns {Promise<string|null>} - Chemin de l'image ou null si non trouvée
 */
async function getImagePath(filename) {
    const paths = [
        path.join(__dirname, '..', 'uploads', 'optimized', filename),
        path.join(__dirname, '..', 'uploads', filename)
    ];

    for (const imagePath of paths) {
        if (await fileExists(imagePath)) {
            return imagePath;
        }
    }
    return null;
}

/**
 * Configure les en-têtes de sécurité et de cache pour les images
 * @param {Response} res - Objet response Express
 */
function setImageHeaders(res) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || 'http://localhost:3001');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
}

module.exports = {
    getImagePath,
    setImageHeaders
}; 