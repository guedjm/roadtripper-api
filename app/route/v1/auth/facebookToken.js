var express = require('express');
var router = express.Router();
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var userModel = require(__base + 'app/model/user');

router.get('', function (req, res, next) {

  //Check auth
  if (req.authType != 'full' || req.authUser == undefined || req.authClient == undefined || req.authToken == undefined) {
    next(error.userAuthRequired);
  }
  else {

    //Get user
    userModel.getById(req.authUser, function (err, user) {
      if (err) {
        logger.error('Unable to get user by id');
        next(err);
      }
      else {

        var reply = {
          facebookToken: user.facebookToken
        };
        res.send(reply);
      }
    });
  }
});

router.post('', function (req, res, next) {

  //Check auth
  if (req.authType != 'full' || req.authUser == undefined || req.authClient == undefined || req.authToken == undefined) {
    next(error.userAuthRequired);
  }
  else {

    //Check body
    if (req.body.facebookToken == undefined) {
      next(error.invalidRequestError);
    }
    else {

      //Get user
      userModel.getById(req.authUser, function (err, user) {
        if (err) {
          logger.error('Unable to get user by id');
          next(err);
        }
        else {

          user.updateFbToken(req.body.facebookToken, function (err) {
            if (err) {
              logger.error('Unable to update facebook token');
              next(err);
            }
            else {
              logger.info('Facebook token updated');
              var reply = {
                facebookToken: user.facebookToken
              };
              res.send(reply);
            }
          });

        }
      });
    }
  }
});

module.exports = router;