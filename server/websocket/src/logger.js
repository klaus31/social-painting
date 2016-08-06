var winston = require('winston');
var environment = require('/environment/config.json');

var logger = new(winston.Logger)({
  transports: [new winston.transports.File({
    filename: environment.logger.files.main,
    level: environment.logger.level || 'info',
    json: false
  }), new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.File({
    filename: environment.logger.files.error,
    json: false
  }), new winston.transports.Console()],
  exitOnError: false
});

module.exports = logger;