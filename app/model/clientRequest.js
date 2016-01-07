var mongoose = require('mongoose');

var clientRequestSchema = new mongoose.Schema({
  date: Date,
  method: String,
  url: String,
  param: {},
  body: {},
  auth: String,
  authenticationType: String,
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

clientRequestSchema.statics.createRequest = function (method, url, param, body, auth, authType, clientId, userId, cb) {

  var now = new Date();

  clientRequestModel.create({
    date: now,
    method: method,
    url: url,
    param: param,
    body: body,
    auth: auth,
    authenticationType: authType,
    client: clientId,
    user: userId
  }, cb);
};

var clientRequestModel = mongoose.model('clientRequest', clientRequestSchema);

module.exports = clientRequestModel;