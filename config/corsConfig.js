module.exports = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}; 