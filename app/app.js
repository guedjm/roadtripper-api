var express = require('express');
var bodyParser = require('body-parser');

var config = require(__base + 'config');
var logger = require(__base + 'app/misc/logger');
var error = require(__base + 'app/misc/error');

logger.info('Initializing app ...');

var app = express();

//Setting middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// 404 error
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;*/

  logger.info('404 not found : ' + req.baseUrl + req.url);

  next(error.notFoundError);
});

//Error handler
app.use(function(err, req, res, next) {

  if (err.status == 500 && err.stack) {
    logger.error(req.baseUrl);
    logger.error(err.stack);
    err = error.internalServerError;
  }
  else {
    logger.info('Replying [' + err.status + '] : ' + err.message);
  }
  res.status(err.status || 500);
  res.send({status: err.status, error: err.message});
});

logger.info('app initialized');

module.exports = app;
