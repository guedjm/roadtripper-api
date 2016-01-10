var mongoose = require('mongoose');
var sha1 = require('sha1');

var userSchema = new mongoose.Schema({
  publicId: String,
  facebookId: String,

  facebookToken: String,

  firstName: String,
  lastName: String,
  name: String,
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],

  registrationDate: Date,
  registrationRequest: {type: mongoose.Schema.Types.ObjectId, ref: 'clientRequest'}
});

userSchema.statics.createUser = function (id, lltoken, firstName, lastName, name, clientRequestId, cb) {

  userModel.create({
    publicId: sha1(id + firstName),
    facebookId: id,
    facebookToken: lltoken,
    firstName: firstName,
    lastName: lastName,
    name: name,
    registrationDate: new Date(),
    registrationRequest: clientRequestId
  }, cb);
};

userSchema.statics.getById = function (id, cb) {
  userModel.findOne({_id: id}, cb);
};

userSchema.statics.getByFacebookId = function (id, cb) {

  userModel.findOne({facebookId: id}, cb);
};

userSchema.methods.setFriend = function (friends, cb) {
  this.friends = friends;
  this.save(cb);
};

userSchema.methods.updateFbToken  = function (token, cb) {

  this.facebookToken = token;
  this.save(cb);
};

userSchema.methods.addFriend = function (id, cb) {
  this.friends.push(id);
  this.save(cb);
};

userSchema.methods.getFriend = function (cb) {
  this.populate('friends', 'publicId facebookId firstName lastName name', function (err, user) {
    if (err) {
      cb(err, null);
    }
    else {
      var friends = [];
      user.friends.forEach(function (elem, i, a) {
        friends.push({
          facebookId: elem.facebookId,
          publicId: elem.publicId,
          firstName: elem.firstName,
          lastName: elem.lastName,
          name: elem.name
        });
      });
      cb(null, friends);
    }
  });
};

var userModel = mongoose.model('user', userSchema);

module.exports = userModel;