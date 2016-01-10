var express = require('express');
var router = express.Router();
var error = require(__base + 'app/misc/error');
var logger = require(__base + 'app/misc/logger');
var clientModel = require(__base + 'app/model/client');

router.post('', function (req, res, next) {

  //Check auth
  if (req.authType != 'basic' || req.authClient == undefined || req.authClient.type != 3) {
    next(error.unauthorizedError);
  }
  else {

    //Check request
    if (req.body.type == undefined || req.body.type > 2 || req.body.name == undefined) {
      next(error.invalidRequestError);
    }
    else {

      logger.info('Creating new client');

      clientModel.createClient(req.body.type, req.body.name, true, function (err, newClient) {
        if (err) {
          logger.error('Unable to create client');
          next(err);
        }
        else {

          var reply = {
            id: newClient.id,
            name: newClient.name,
            secret: newClient.secret,
            activated: newClient.activated
          };

          res.send(reply);
        }
      });
    }
  }
});

module.exports = router;