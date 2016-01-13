var express = require('express');
var router = express.Router();
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var userModel = require(__base + 'app/model/user');


router.get('', function (req, res, next) {

  //Check auth
  if (req.authType != 'full' || req.authUser == undefined || req.authClient == undefined) {
    next(error.unauthorizedError);
  }
  else {

    userModel.getById(req.authUser, function (err, user) {

      if (err) {
        logger.error('Unable to retrieve user');
        next(err);
      }
      else {

        var reply = {
          publicId: user.publicId,
          facebookId: user.facebookId,
          facebookToken: user.facebookToken,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name
        };
        res.send(reply);
      }
    });
  }
});


module.exports = router;