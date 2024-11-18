// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API CDN Sécurisée',
            version: '1.0.0',
            description: 'API de gestion d\'images avec optimisation automatique et sécurité renforcée',
            contact: {
                name: 'Support API',
                email: 'support@api.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            },
            {
                url: 'https://api.production.com',
                description: 'Serveur de production'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Message d\'erreur'
                        }
                    }
                },
                UploadResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Statut de l\'upload'
                        },
                        filename: {
                            type: 'string',
                            description: 'Nom du fichier généré'
                        }
                    }
                }
            }
        }
    },
    apis: ['./server.js'] // Chemin vers vos fichiers contenant les routes
};

// Modification du fichier server.js pour inclure la documentation des routes
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload une image
 *     description: Upload et optimise une image avec génération automatique de différentes tailles et formats
 *     tags:
 *       - Images
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image (JPG, PNG, ou WEBP)
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token manquant
 *       403:
 *         description: Token invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /image/{filename}:
 *   get:
 *     summary: Récupère une image
 *     description: Récupère une image optimisée avec possibilité de spécifier la taille et le format
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier image
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *           enum: [200, 400, 800]
 *         description: Largeur souhaitée de l'image
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [jpeg, webp]
 *         description: Format souhaité de l'image
 *     responses:
 *       200:
 *         description: Image récupérée avec succès
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Paramètres invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Image non trouvée
 *       500:
 *         description: Erreur serveur
 */

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configuration de l'interface Swagger
const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Documentation API CDN",
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        tryItOutEnabled: true
    }
};

// Export de la configuration Swagger
module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(swaggerSpec, swaggerUiOptions),
    spec: swaggerSpec
};