var mongoose = require('mongoose');
var config = require(__base + 'config');
var sha1 = require('sha1');

var tokenSchema = new mongoose.Schema({
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'client'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},

  token: String,
  oldToken: {type: mongoose.Schema.Types.ObjectId, ref: 'token'},

  deliveryDate: Date,
  expirationDate: Date,
  renewExpirationDate: Date,
  usable: Boolean,
  revokeDate: Date
});

tokenSchema.statics.getToken = function (token, cb) {
  tokenModel.findOne({token: token, usable: true, expirationDate: {$gt: new Date()}}, cb);
};

tokenSchema.statics.getRenewableToken = function (token, cb) {
  tokenModel.findOne({token: token, usable: true, renewExpirationDate: {$gt: new Date()}}, cb);
};

tokenSchema.statics.getTokenForRenew = function (token, cb) {
  tokenModel.findOne({token: token, usable: true, expirationDate: {$lt: new Date()}, renewExpirationDate: {$gt: new Date()}}, cb);
};

tokenSchema.statics.getByUserClient = function (userId, clientId, cb) {
  tokenModel.findOne({client: clientId, user: userId, usable: true, expirationDate: {$gt: new Date()}}, cb);
};

tokenSchema.statics.createToken = function (userId, clientId, cb) {

  var now = new Date();
  var expirationDate = new Date(now.getTime() + config.security.tokenDurationMin * 60000);
  var renewDate = new Date(now.getTime() + config.security.renewTokenDurationMin * 60000);

  tokenModel.create({
    client: clientId,
    user: userId,
    token: sha1(clientId + userId + now.toTimeString()),
    deliveryDate: now,
    expirationDate: expirationDate,
    renewExpirationDate: renewDate,
    usable: true
  }, cb);
};

tokenSchema.methods.revoke = function (cb) {
  this.usable = false;
  this.revokeDate = new Date();
  this.save(cb);
};

tokenSchema.methods.renew = function (cb) {
  var oldToken = this;

  this.revoke(function (err) {
    if (err) {
      cb(err, null);
    }
    else {

      var now = new Date();
      var expirationDate = new Date(now.getTime() + config.security.tokenDurationMin * 60000);
      var renewDate = new Date(now.getTime() + config.security.renewTokenDurationMin * 60000);

      tokenModel.create({
        client: oldToken.client,
        user: oldToken.user,
        token: sha1(oldToken.clientId + oldToken.user + now.toTimeString()),
        oldToken: oldToken._id,
        deliveryDate: now,
        expirationDate: expirationDate,
        renewExpirationDate: renewDate,
        usable: true
      }, cb);
    }
  });
};

var tokenModel = mongoose.model('token', tokenSchema);

module.exports = tokenModel;