//TODO: Implement tests
//TODO: Create a back end website
//TODO: Start the roadtripper-server

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

//Custom middleware
var authMiddleware = require(__base + 'app/middleware/authorization');
app.use(authMiddleware);

//Routes
var ping = require(__base + 'app/route/ping');

var client = require(__base + 'app/route/v1/client');

var userFriend = require(__base + 'app/route/v1/user/friend');
var userInfo = require(__base + 'app/route/v1/user/info');

var authLogin = require(__base + 'app/route/v1/auth/login');
var authToken = require(__base + 'app/route/v1/auth/token');
var authRenew = require(__base + 'app/route/v1/auth/renew');
var authFbToken = require(__base + 'app/route/v1/auth/facebookToken');

app.use('/ping', ping);

app.use('/v1/client', client);

app.use('/v1/user/info', userInfo);
app.use('/v1/user/friend', userFriend);

app.use('/v1/auth/login', authLogin);
app.use('/v1/auth/token', authToken);
app.use('/v1/auth/renew', authRenew);
app.use('/v1/auth/facebooktoken', authFbToken);

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
    logger.info('Replying [' + err.httpStatusCode + '] : "' + err.message + '" (' + err.errorCode + '/' + err.errorSubCode  + ')');
  }
  res.status(err.httpStatusCode);
  res.send({
    error: {
      message: err.message,
      errorCode: err.errorCode,
      errorSubCode: err.errorSubCode}
  });
});

logger.info('app initialized');

module.exports = app;
