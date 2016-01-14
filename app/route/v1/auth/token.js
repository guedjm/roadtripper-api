var express = require('express');
var router = express.Router();
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var userModel = require(__base + 'app/model/user');
var clientModel = require(__base + 'app/model/client');

router.get('', function (req, res, next) {

  //Check auth
  if (req.authType != 'full' || req.authUser == undefined || req.authClient == undefined || req.authToken == undefined) {
    next(error.userAuthRequired);
  }
  else {

    // Getting client data
    clientModel.getById(req.authClient, function (err, client) {

      if (err) {
        logger.error('Unable to retrieve client');
        next(err);
      }
      else {

        //Getting user info
        userModel.getById(req.authUser, function (err, user) {
          if (err) {
            logger.error('Unable to retrieve user');
            next(err)
          }
          else {

            //Replying
            var reply = {
              token: {
                token: req.authToken.token,
                deliveryDate: req.authToken.deliveryDate.toString(),
                expirationDate: req.authToken.expirationDate.toString(),
                renewExpirationDate: req.authToken.renewExpirationDate.toString()
              },
              client: {
                name: client.name,
                id: client.id
              },
              user: {
                publicId: user.publicId,
                name: user.name
              }
            };
            res.send(reply);
          }
        });
      }
    });
  }
});

module.exports = router;