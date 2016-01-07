var mongoose = require('mongoose');
var config = require(__base + 'config');
var logger = require(__base + 'app/misc/logger');

function initializeConnection() {

  logger.info('Initializing database connection ...');

  mongoose.connection.on('open', function () {
    logger.info('Database connection initialized');
  });

  mongoose.connection.on('error', function () {
    logger.error('Unable to connect to the database ...');
    process.exit(1);
  });

  mongoose.connect('mongodb://' + config.database.ip + ':' + config.database.port + '/' + config.database.database);
};


module.exports.initializeConnection = initializeConnection;
