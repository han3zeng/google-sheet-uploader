const path = require('path');
const { createLogger, format, transports } = require('winston');

const targetDirectory = path.resolve(__dirname, '../../logs');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'google-sheet-uploader' },
  transports: [
    new transports.File({ filename: `${targetDirectory}/error.log`, level: 'error' }),
    new transports.File({ filename: `${targetDirectory}/history.log` })
  ]
});

module.exports = logger;
