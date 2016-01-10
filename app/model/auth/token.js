var mongoose = require('mongoose');
var config = require(__base + 'config');
var sha1 = require('sha1');

var tokenSchema = new mongoose.Schema({
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'client'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},

  token: String,

  deliveryDate: Date,
  expirationDate: Date,
  usable: Boolean,
  revokeDate: Date
});

tokenSchema.statics.getToken = function (token, cb) {
  tokenModel.findOne({token: token, usable: true, expirationDate: {$gt: new Date()}}, cb);
};

tokenSchema.statics.getByUserClient = function (userId, clientId, cb) {
  tokenModel.findOne({client: clientId, user: userId, usable: true, expirationDate: {$gt: new Date()}}, cb);
};

tokenSchema.statics.createToken = function (userId, clientId, cb) {

  var now = new Date();
  var expirationDate = new Date(now.getTime() + config.security.tokenDurationMin * 60000);

  tokenModel.create({
    client: clientId,
    user: userId,
    token: sha1(clientId + userId + now.toTimeString()),
    deliveryDate: now,
    expirationDate: expirationDate,
    usable: true
  }, cb);
};

tokenSchema.methods.revoke = function (cb) {
  this.usable = false;
  this.revokeDate = new Date();
  this.save(cb);
};

var tokenModel = mongoose.model('token', tokenSchema);

module.exports = tokenModel;