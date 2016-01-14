var request = require('request');
var querystring = require('querystring');
var config = require(__base + 'config');
var logger = require(__base + 'app/misc/logger');
var error = require(__base + 'app/misc/error');

function getUserInformation(token, userId, cb) {

  var url = config.facebookApi.url + '/' + userId + '?';
  var param = {
    fields: 'first_name,last_name,name',
    access_token: token
  };

  url += querystring.stringify(param);

  request.get(url, function (err, res, body) {
    if (err) {
      logger.error('Unable to get on facebook api');
      cb(err, null);
    }
    else if (res.statusCode != 200) {
      cb(handleError(body), null);
    }
    else {

      var reply = JSON.parse(body);
      if (reply.id == undefined || reply.first_name == undefined ||
        reply.last_name == undefined || reply.name == undefined) {
        logger.error('Invalid facebook reply (body)');
        logger.error(body);
        cb(error.invalidFacebookReply, null);
      }
      else {
        cb(null, reply);
      }
    }
  });
}

function getUserFriends(token, userId, cb) {

  var url = config.facebookApi.url + '/' + userId + '/friends?';
  var param = {
    fields: 'first_name,last_name,name',
    access_token: token
  };
  var friends = [];

  url += querystring.stringify(param);

  getUserFriendPage(url, friends, cb);
}

function getUserFriendPage(url, friends, cb) {

  request.get(url, function (err, res, body) {
    if (err) {
      logger.error('Unable to get on facebook api');
      cb(err, null);
    }
    else if (res.statusCode != 200) {
      cb(handleError(body), null);
    }
    else {

      var reply = JSON.parse(body);

      if (reply.data == undefined || Array.isArray(reply.data) == false) {
        logger.error('Invalid facebook reply (status)');
        logger.error(body);
        cb(error.invalidFacebookReply, null);
      }
      else {

        var f = friends.concat(reply.data);
        if (reply.paging != undefined && reply.paging.next != undefined) {
          getUserFriendPage(reply.paging.next, f, cb);
        }
        else {
          cb(null, friends);
        }
      }
    }
  });
}

function getLongLivedToken(token, cb) {

  var url = config.facebookApi.url + '/oauth/access_token?';
  var param = {
    grant_type: 'fb_exchange_token',
    client_id: config.facebookApi.clientId,
    client_secret: config.facebookApi.clientSecret,
    fb_exchange_token: token
  };

  url += querystring.stringify(param);

  request.get(url, function (err, res, body) {
      if (err) {
        logger.error('Unable to get on facebook api');
        cb(err, null);
      }
      else if (res.statusCode != 200) {
         cb(handleError(body), null);
      }
      else {

        var reply = JSON.parse(body);

        if (reply.access_token == undefined) {
          logger.info('Invalid reply form facebook api (body)');
          logger.info(body);
          cb(error.invalidFacebookReply, null);
        }
        else {
          cb(null, reply.access_token);
        }
      }
    });
}

function handleError(body) {

  var err;
  var fbError = JSON.parse(body).error;

  if (fbError.type == "OAuthException") {
    logger.info('Invalid token : ' + fbError.message);
    err = error.fbInvalidToken;
    err.errorSubCode = fbError.error_subcode;
  }
  else {
    logger.error('Facebook request error');
    logger.error(body);
    err = error.invalidFacebookReply;
  }
  return (err);
}

module.exports.getUserInformation = getUserInformation;
module.exports.getUserFriends = getUserFriends;
module.exports.getLongLivedToken = getLongLivedToken;