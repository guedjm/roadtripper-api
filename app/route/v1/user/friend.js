var express = require('express');
var router = express.Router();
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var fbService = require(__base + 'app/service/facebookApi');
var userModel = require(__base + 'app/model/user');

router.get('', function (req, res, next) {

  //Check auth
  if (req.authType != 'full' || req.authUser == undefined || req.authClient == undefined) {
    next(error.userAuthRequired);
  }
  else {

    //Get user
    userModel.getById(req.authUser, function (err, user) {
      if (err) {
        logger.error('Unable to retrieve user');
        next(err);
      }
      else if (user == undefined) {
        logger.error('Unable to find user');
        next(error.internalServerError);
      }
      else {

        //Get friend from facebook
        fbService.getUserFriends(user.facebookToken, 'me', function (err, friends) {
          if (err) {
            next(err);
          }
          else {

            var friendsId = [];
            var friendsInfo = [];

            friends.forEach(function (elem, i, a) {
              userModel.getByFacebookId(elem.id, function (err, fuser) {
                if (err) {
                  logger.error('Unable to retrieve user');
                  next(err);
                }
                else if (fuser != undefined) {
                  friendsId.push(fuser._id);
                  friendsInfo.push({
                    facebookId: fuser.facebookId,
                    publicId: fuser.publicId,
                    firstName: fuser.firstName,
                    lastName: fuser.lastName,
                    name: fuser.name
                  });
                }

                if (i == friends.length - 1) {

                  //Reply
                  res.send(friendsInfo);

                  //Update friends
                  user.setFriend(friendsId, function (err) {
                    if (err) {
                      logger.error('Unable to update friends');
                      next(err);
                    }
                    else {
                      logger.info('Friend updated');
                    }
                  });
                }
              });
            });

            //If there is no friend
            if (friends.length == 0) {
              //Reply
              res.send(friendsInfo);

              //Update friends
              user.setFriend(friendsId, function (err) {
                if (err) {
                  logger.error('Unable to update friends');
                  next(err);
                }
                else {
                  logger.info('Friend updated');
                }
              })
            }
          }
        });
      }
    });
  }
});

module.exports = router;