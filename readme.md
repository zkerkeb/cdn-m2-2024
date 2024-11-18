# CDN Simple

Ce projet est une implémentation basique d'un CDN (Content Delivery Network) en Node.js, permettant l'upload, l'optimisation et la distribution d'images.

## Fonctionnalités

- Upload d'images
- Génération automatique de versions optimisées (différentes tailles et formats)
- Mise en cache des réponses
- Serving des images avec en-têtes de cache appropriés
- Génération d'URL signées pour un accès sécurisé

## Prérequis

- Node.js (v12 ou supérieur)
- npm (normalement installé avec Node.js)

## Installation

1. Clonez ce dépôt :
   ```
   git clone [URL_DU_REPO]
   cd [NOM_DU_DOSSIER]
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

3. Créez un dossier `uploads` à la racine du projet :
   ```
   mkdir uploads
   ```

## Configuration

1. Le port par défaut est 3000. Vous pouvez le modifier dans le fichier principal si nécessaire.
2. Pour les URL signées, remplacez `'votre_secret_key'` par une clé secrète forte.

## Utilisation

### Démarrer le serveur

```
node [nom_du_fichier_principal].js
```

Le serveur démarrera sur `http://localhost:3000` (ou le port que vous avez configuré).

### Upload d'une image

Utilisez une requête POST vers `/upload` avec un formulaire multipart contenant un champ 'image'.

Exemple avec cURL :
```
curl -X POST -F "image=@chemin/vers/votre/image.jpg" http://localhost:3000/upload
```

### Accéder à une image

Utilisez une requête GET vers `/image/[nom_du_fichier]`.

Options :
- `width`: Spécifiez la largeur souhaitée
- `format`: Spécifiez le format souhaité (jpeg ou webp)

Exemple :
```
http://localhost:3000/image/mon_image.jpg?width=400&format=webp
```

### Générer une URL signée

Utilisez la fonction `generateSignedUrl` dans votre code pour générer une URL signée.

Exemple d'utilisation :
```javascript
const signedUrl = generateSignedUrl('mon_image.jpg', 3600); // Expire dans 1 heure
```

Accédez ensuite à l'image via l'URL générée.

## Bonnes pratiques

1. En production, utilisez HTTPS pour toutes les communications.
2. Changez régulièrement la clé secrète utilisée pour les URL signées.
3. Mettez en place un système de rotation des logs pour le suivi des accès et des erreurs.
4. Surveillez l'utilisation du disque et mettez en place une stratégie de nettoyage des fichiers anciens ou inutilisés.

## Limitations actuelles

- Pas de gestion des erreurs avancée
- Pas d'authentification pour l'upload
- Stockage local uniquement (pas d'intégration avec des services de stockage cloud)
- Pas de compression gzip/brotli pour le transfert

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

[Insérez ici la licence de votre choix]