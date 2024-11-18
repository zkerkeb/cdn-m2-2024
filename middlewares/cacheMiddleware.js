

// ========== CACHE SÉCURISÉ ==========

const cache = new Map();
const cacheStats = {
    hits: 0,
    misses: 0
};

const cacheMiddleware = (duration) => (req, res, next) => {
    const key = req.url; // Crée une clé de cache basée sur l'URL de la requête
    const cachedResponse = cache.get(key); // Vérifie si une réponse est déjà en cache pour cette clé

    if (cachedResponse && Date.now() < cachedResponse.expiresAt) { // Vérifie si la réponse en cache est encore valide
        cacheStats.hits++; // Incrémente le compteur de hits de cache
        return res.send(cachedResponse.data); // Renvoie la réponse en cache
    }

    cacheStats.misses++; // Incrémente le compteur de misses de cache
    res.sendResponse = res.send; // Sauvegarde la méthode d'envoi de réponse d'origine
    res.send = (body) => { // Redéfinit la méthode d'envoi de réponse
        cache.set(key, { // Stocke la nouvelle réponse dans le cache
            data: body,
            expiresAt: Date.now() + duration // Définit la durée de validité du cache
        });
        res.sendResponse(body); // Envoie la réponse au client
    };
    next(); // Passe au middleware suivant
};

module.exports = cacheMiddleware;
