
var invalidRequestError = {
  status : 400,
  message : 'Invalid request, check documentation for more details',
  code: 0
};

var unauthorizedError = {
  code: 1,
  status : 401,
  message : 'Unauthorized request'};

var invalidToken = {
  status: 401,
  message: 'Invalid token',
  code: 2
};

var fbInvalidToken = {
  code: 3,
  status: 401,
  message: 'Invalid facebook access token'
};

var notFoundError = {
  status : 404,
  message : 'Not Found'};

var internalServerError = {
  status : 500,
  message : 'Internal server error'};

var invalidFacebookReply = {
  status: 500,
  message: 'Internal server error (facebook reply)',
  code: 1
};

module.exports.invalidRequestError = invalidRequestError;
module.exports.unauthorizedError = unauthorizedError;
module.exports.fbInvalidToken = fbInvalidToken;
module.exports.invalidToken = invalidToken;
module.exports.notFoundError = notFoundError;
module.exports.internalServerError = internalServerError;
module.exports.invalidFacebookReply = invalidFacebookReply;