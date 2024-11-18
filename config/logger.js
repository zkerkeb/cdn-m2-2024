const pino = require('pino');

const logger = pino({
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname'
                },
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
            },
            {
                target: 'pino-roll',
                options: {
                    file: './logs/app.log',
                    size: '10m',        // Rotation quand le fichier atteint 10MB
                    interval: '1d',     // Rotation quotidienne
                    maxFiles: 5         // Garde les 5 derniers fichiers
                },
                level: 'info'
            }
        ]
    }
});

module.exports = logger;  