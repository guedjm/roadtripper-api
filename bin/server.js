var express = require('express');
var http = require('http');

//Defining project root path
global.__base = __dirname + '/../';

var config = require(__base + 'config');
var logger = require(__base + 'app/misc/logger');
var database = require(__base + 'app/misc/database');

function start() {

  logger.info('Logger started');

  database.initializeConnection();

  var app = require(__base + 'app/app');

  logger.info('Initializing http server ...');

  var httpServer = http.createServer(app);

  httpServer.on('error', function (error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = 'Port ' + config.server.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  httpServer.on('listening', function () {
    logger.info('Http server started on port ' + config.server.port);
  });

  httpServer.listen(config.server.port);
}

function disableLog() {
  logger.level = 'error';
}

module.exports.start = start;
module.exports.disableLog = disableLog;