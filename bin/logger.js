var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/../logs/debug.log', json: false, maxsize:50000, maxFiles:10 })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/../logs/exceptions.log', json: false, maxsize:50000, maxFiles:10 })
  ],
  exitOnError: false
});

module.exports = logger;
