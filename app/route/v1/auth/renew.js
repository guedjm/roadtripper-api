var express = require('express');
var router = express.Router();
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var tokenModel = require(__base + 'app/model/auth/token');

router.get('', function (req, res, next) {

  // Check auth
  if (req.authType != 'basic' || req.authClient == undefined) {
    next (error.clientAuthRequired);
  }
  else {

    //Check request
    if (req.query.access_token == undefined) {
      next(error.invalidRequestError);
    }
    else {

      logger.info('Receive a renew token request');

      //Get token
      tokenModel.getTokenForRenew(req.query.access_token, function (err, token) {
        if (err) {
          logger.error('Unable to retrieve token');
          next(err);
        }
        else if (token == undefined) {
          logger.info('Invalid token');
          next(error.invalidRequestError);
        }
        else {

          //Check if clients are same
          if (req.authClient._id.toString() != token.client) {
            logger.info('Client mismatch');
            next(error.invalidRequestError);
          }
          else {

            logger.info('Renewing token ...');
            token.renew(function (err, newToken) {
              if (err) {
                logger.error('Unable to renew token');
                next(err);
              }
              else {

                logger.info('New token is ' + newToken.token);
                var reply = {
                  access_token: newToken.token
                };
                res.send(reply);
              }
            });
          }
        }
      });
    }
  }
});

module.exports = router;