var express = require('express');
var router = express.Router();
var config = require(__base + 'config');
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var userModel = require(__base + 'app/model/user');
var tokenModel = require(__base + 'app/model/auth/token');
var fbService = require(__base + 'app/service/facebookApi');

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

                          logger.info('Getting user friends');
                          //Getting user friends
                          getNewUserFriends(cuser._id, facebookToken, true, function (err, dbFriends, replyFriends) {

                            cuser.setFriend(dbFriends, function (err) {
                              if (err) {
                                logger.error('Unable to update user friend');
                                next(err);
                              }
                              else {
                                //Generating token
                                generateToken(cuser._id, req.authClient._id, function (err, token) {
                                  if (err) {
                                    logger.error('Unable to generate token');
                                    next(err);
                                  }
                                  else {
                                    //Replying
                                    var reply = {
                                      publicId: cuser.publicId,
                                      fbToken: llToken,
                                      accessToken: token.token,
                                      firstName: cuser.firstName,
                                      lastName: cuser.lastName,
                                      name: fbUser.name,
                                      friends: replyFriends
                                    };
                                    res.send(reply);
                                  }
                                });
                              }
                            });
                          });
                        }
                      });
                  }
                  else {

                    logger.info('Getting user friends form db');
                    //Getting user friend from db
                    user.getFriend(function (err, friends) {
                      if (err) {
                        logger.error('Unable to get user friends');
                        next(err);
                      }
                      else {

                        //Update facebook token
                        logger.info('Updating facebook token');
                        user.updateFbToken(llToken, function (err) {});

                        //Generating token
                        generateToken(user._id, req.authClient._id, function (err, token) {
                          if (err) {
                            next(err);
                          }
                          else {
                            var reply = {
                              publicId: user.publicId,
                              fbToken: llToken,
                              accessToken: token.token,
                              firstName: user.firstName,
                              lastName: user.lastName,
                              name: fbUser.name,
                              friends: friends
                            };

                            //Send reply
                            res.send(reply);
                          }
                        });
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

function getNewUserFriends(userId, facebookToken, creation, cb) {

  var dbFriendsInformation = [];
  var replyFriendsInformation = [];

  fbService.getUserFriends(facebookToken, 'me', function (err, friends) {
    if (err) {
      cb (err, null, null);
    }
    else if (friends.length > 0)
    {
      friends.forEach(function (val, i, a) {
        userModel.getByFacebookId(val.id, function (err, fuser) {
          if (err) {
            logger.error('Unable to get user by FbId');
            cb(err, null, null);
          }
          else if (fuser != undefined) {

            if (creation) {
              fuser.addFriend(userId, function (err) {
                if (err) {
                  cb(err, null, null);
                }
              });
            }

            dbFriendsInformation.push(fuser._id);

            replyFriendsInformation.push({
              facebookId: val.id,
              publicId: fuser.publicId,
              firstName: val.first_name,
              lastName: val.last_name,
              name: val.name
            });
          }

          if (i == a.length - 1) {
            cb(null, dbFriendsInformation, replyFriendsInformation);
          }
        });
      });
    }
    else {
      cb(null, [], []);
    }
  });
}

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