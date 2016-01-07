
var notFoundError = {
  status : 404,
  message : 'Not Found'};

var internalServerError = {
  status : 500,
  message : 'Internal server error'};

module.exports.notFoundError = notFoundError;
module.exports.internalServerError = internalServerError;