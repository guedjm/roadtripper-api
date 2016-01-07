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


//Routes
var ping = require(__base + 'app/route/ping');

app.use('/ping', ping);


// 404 error
app.use(function(req, res, next) {
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
    logger.info('Replying [' + err.status + '] : "' + err.message + '" (code: ' + err.code + ')');
  }
  res.status(err.status);
  res.send({code: err.code, error: err.message});
});

logger.info('app initialized');

module.exports = app;
