// Middleware pour forcer l'utilisation de HTTPS en production
// - Vérifie si l'application est en environnement de production
// - Intercepte toutes les requêtes HTTP
// - Redirige automatiquement vers HTTPS si la requête n'est pas sécurisée
// - Utilise le même hôte et chemin que la requête originale
const forceHttps = (req, res, next) => {
    if (!req.secure) {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
};

module.exports = forceHttps; 