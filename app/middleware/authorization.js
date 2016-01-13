var logger = require(__base + 'app/misc/logger');
var clientRequestModel = require(__base + 'app/model/clientRequest');
var clientModel = require(__base + 'app/model/client');
var tokenModel = require(__base + 'app/model/auth/token');

function getAuthorization(req, res, next) {

  logger.info('Received a request : ' + req.method + ' ' + req.baseUrl + req.url);

  if (req.get('Authorization') == undefined) {
    clientRequestModel.createRequest(req.method, req.url, req.query, req.body, null, null, null, null, function (err, creq) {});
    logger.info('No Authorization in header');
    next();
  }
  else {

    logger.info('Authorization header is ' + req.get('Authorization'));

    var authParam = req.get('Authorization').split(' ');

    if (authParam.length != 2) {
      clientRequestModel.createRequest(req.method, req.url, req.query, req.body, req.get('Authorization'), null, null, null, function (err, creq) {});
      next();
    }
    else {

      if (authParam[0] == 'Basic') {
        basicAuthentication(authParam[1], function (err, client) {

          if (err || client == null) {
            clientRequestModel.createRequest(req.method, req.url, req.query, req.body, req.get('Authorization'), 'basic', null, null, function (err, creq) {});

            if (err) {
              next(err);
            } else {
              next();
            }
          }
          else {
            clientRequestModel.createRequest(req.method, req.url, req.query, req.body, req.get('Authorization'), 'basic', client._id, null,
            function (err, creq) {
              if (err) {
                logger.error('Unable to create request');
                next(error);
              }
              else {
                req.authType = 'basic';
                req.authClient = client;
                req.clientRequest = creq;
                next();
              }
            });
          }
        });
      }
      else if (authParam[0] == 'Bearer') {
        tokenAuthentication(authParam[1], function (err, token) {
          if (err || token == undefined) {
            clientRequestModel.createRequest(req.method, req.url, req.query, req.body, req.get('Authorization'), 'full', null, null, function (err, creq) {});
            if (err) {
              next(err);
            } else {
              next();
            }
          }
          else {
            clientRequestModel.createRequest(req.method, req.url, req.query, req.body, req.get('Authorization'), 'full', token.client, token.user,
            function (err, creq) {
              if (err) {
                logger.error('Unable to create request');
                next(err);
              }
              else {
                req.authType = 'full';
                req.authClient = token.client;
                req.authUser = token.user;
                req.authToken = token;
                req.clientRequest = creq;
                next();
              }
            });
          }
        });
      }
      else {
        next();
      }
    }
  }
}

function basicAuthentication(clientSecret, cb) {

  logger.info('Authenticating client ...');

  clientModel.getClientBySecret(clientSecret, function (err, client) {
    if (err) {
      logger.error('Unable to find client');
      cb(err, null);
    }
    else if (client == undefined) {
      logger.info('Client not found');
      cb(null, null);
    }
    else {
      logger.info('Client is ' + client.name);
      cb(null, client);
    }
  });
}

function tokenAuthentication(token , cb) {

  logger.info('Authenticating user ...');

  tokenModel.getToken(token, function (err, token) {
    if (err) {
      logger.error('Unable to find token');
      cb(err, null);
    }
    else if (token == undefined) {
      logger.info('Token not found');
      cb(null, null);
    }
    else {
      logger.info('Client is ' + token.client);
      logger.info('User is ' + token.user);
      cb(null, token);
    }
  });
}

module.exports = getAuthorization;