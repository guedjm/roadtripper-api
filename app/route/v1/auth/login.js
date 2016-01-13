var express = require('express');
var router = express.Router();
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var fbService = require(__base + 'app/service/facebookApi');
var userModel = require(__base + 'app/model/user');
var tokenModel = require(__base + 'app/model/auth/token');

router.post('', function (req, res, next) {

  //Check auth
  if (req.authType != 'basic' || req.authClient == undefined) {
    next(error.unauthorizedError);
  }
  else {

    //Check body
    if (req.body.facebookToken == undefined) {
      next(error.invalidRequestError);
    }
    else {

      var facebookToken = req.body.facebookToken;

      // Get user information from facebook
      logger.info('Getting user facebook information');
      fbService.getUserInformation(facebookToken, 'me', function (err, fbUser) {
        if (err) {
          next(err);
        }
        else {

          //Get long lived fb Token
          logger.info('Getting long lived facebook token');
          fbService.getLongLivedToken(facebookToken, function (err, llToken) {
            if (err) {
              next(err);
            }
            else {

              userModel.getByFacebookId(fbUser.id, function (err, user) {
                if (err) {
                  logger.error('Unable to get user (fbId)');
                  next(err);
                }
                else {

                  if (user == undefined) {

                    //Creating new user
                    logger.info('Registering new user ...');
                    userModel.createUser(fbUser.id, llToken, fbUser.first_name, fbUser.last_name, fbUser.name, req.clientRequest._id,
                      function (err, cuser) {

                        if (err) {
                          logger.error('Unable to create user');
                          next(err);
                        }
                        else {
                          logger.info('User ' + fbUser.name + ' created !');

                          //Generating token
                          generateToken(cuser._id, req.authClient._id, function (err, token) {
                            if (err) {
                              logger.error('Unable to generate token');
                              next(err);
                            }
                            else {

                              //Replying
                              var reply = {
                                fbToken: llToken,
                                accessToken: token.token
                              };
                              res.send(reply);
                            }
                          });
                        }
                      });
                  }
                  else {

                    //Update facebook token
                    logger.info('Updating facebook token');
                    user.updateFbToken(llToken, function (err) {});

                    generateToken(user._id, req.authClient._id, function (err, token) {
                      if (err) {
                        next(err);
                      }
                      else {
                        var reply = {
                          fbToken: llToken,
                          accessToken: token.token
                        };

                        //Send reply
                        res.send(reply);
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  }
});

function generateToken(user, client, cb) {

  logger.info('Generating token');

  //Check if token already exist
  tokenModel.getByUserClient(user, client, function (err, token) {
    if (err) {
      logger.error('Unable to retrieve tokens');
      cb(err, null);
    }
    else {
      if (token != undefined) {
        logger.info('Revoking old token');
        token.revoke(function (err) {
          if (err) {
            logger.error('Unable to revoke token');
          }
        });
      }
      tokenModel.createToken(user, client, function (err, token) {
        if (err) {
          logger.error('Unable to create token');
          cb(err, null);
        }
        else {
          cb(null, token);
        }
      });
    }
  });
}

module.exports = router;