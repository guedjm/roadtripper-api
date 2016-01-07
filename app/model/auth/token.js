var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'client'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},

  token: String,

  deliveryDate: Date,
  expirationDate: Date
});

var tokenModel = mongoose.model('token', tokenSchema);

module.exports = tokenModel;