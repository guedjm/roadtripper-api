var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  publicId: String,
  facebookId: String,

  facebookToken: String,

  firstName: String,
  lastName: String,
  closeFriends: [],
  friends: [],

  registrationDate: Date
});

var userModel = mongoose.model('user', userSchema);

module.exports = userModel;