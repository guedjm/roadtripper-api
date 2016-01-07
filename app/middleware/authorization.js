var logger = require(__base + 'app/misc/logger');
var clientRequestModel = require(__base + 'app/model/clientRequest');
var clientModel = require(__base + 'app/model/client');
var userModel = require(__base + 'app/model/user');

function getAuthorization(req, res, next) {

  logger.info('Received a request : ' + req.method + ' ' + req.baseUrl + req.url);

  if (req.get('Authorization') == undefined) {
    clientRequestModel.createRequest(req.method, req.url, req.query, req.body, null, null, null, null,
      function (err, creq) {

      });
    logger.info('No Authorization in header');
    next();
  }
  else {

    logger.info('Authorization header is ' + req.get('Authorization'));

    var authParam = req.get('Authorization').split(' ');

    if (authParam.length != 2) {
      clientRequestModel.createRequest(req.method, req.url, req.query, req.body, req.get('Authorization'), null, null, null,
        function (err, creq) {

        });
      next();
    }
    else {

      //TODO End middleware
    }
  }
}

module.exports = getAuthorization;