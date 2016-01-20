
var invalidRequestError = {
  httpStatusCode : 400,
  errorCode: 1,
  message : 'Invalid request, check documentation for more details'
};

var clientAuthRequired = {
  httpStatusCode : 401,
  errorCode: 1,
  errorSubCode: 1,
  message : 'Request need to be authorized by Client Auth (check documentation for more details)'
};

var userAuthRequired = {
  httpStatusCode : 401,
  errorCode: 1,
  errorSubCode: 2,
  message : 'Request need to be authorized by User Auth (check documentation for more details)'
};

var expiredToken = {
  httpStatusCode: 401,
  errorCode: 2,
  errorSubCode: 1,
  message: 'Token expired, please use POST /v1/auth/renew to obtain a new token'
};

var wrongToken = {
  httpStatusCode: 401,
  errorCode: 2,
  errorSubCode: 2,
  message: 'Invalid token, please use login again to get a new token'
};

var fbInvalidToken = {
  httpStatusCode: 401,
  errorCode: 3,
  errorSubCode: 1,
  message: 'Invalid facebook access token, please update facebook token (POST /v1/auth/facebooktoken)'
};

var notFoundError = {
  httpStatusCode : 404,
  errorCode: 1,
  message : 'Not Found'
};

var internalServerError = {
  httpStatusCode : 500,
  errorCode: 1,
  message : 'Internal server error'};

var invalidFacebookReply = {
  httpStatusCode: 500,
  errorCode: 2,
  message: 'Internal server error (facebook reply)'
};

module.exports.invalidRequestError = invalidRequestError;
module.exports.clientAuthRequired = clientAuthRequired;
module.exports.userAuthRequired = userAuthRequired;
module.exports.expiredToken = expiredToken;
module.exports.wrongToken = wrongToken;
module.exports.fbInvalidToken = fbInvalidToken;
module.exports.notFoundError = notFoundError;
module.exports.internalServerError = internalServerError;
module.exports.invalidFacebookReply = invalidFacebookReply;