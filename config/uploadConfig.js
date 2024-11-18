const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// Validation des entrées
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    // Vérifie si le type de fichier est autorisé
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Type de fichier non supporté'), false);
    }
    
    // Validation du nom de fichier
    // Vérifie si le nom de fichier correspond au format attendu
    if (!/^[a-zA-Z0-9-_\s]+\.(jpg|jpeg|png|webp)$/i.test(file.originalname)) {
        return cb(new Error('Nom de fichier invalide'), false);
    }
    
    // Si tout est valide, passe à la suite
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Génération d'un nom de fichier sécurisé
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

module.exports = upload; 