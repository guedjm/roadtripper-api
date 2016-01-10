var mongoose = require('mongoose');
var sha1 = require('sha1');

var clientSchema = new mongoose.Schema({
  developer: {type: mongoose.Schema.Types.ObjectId},
  id: String,
  type: Number,
  name: String,
  secret: String,
  creationDate: Date,
  activated: Boolean
});

clientSchema.statics.getById = function (id, cb) {
  clientModel.findOne({_id: id}, cb);
};

clientSchema.statics.getClientBySecret = function (secret, cb) {
  clientModel.findOne({secret: secret, activated: true}, cb);
};

clientSchema.statics.createClient = function (type, name, activated, cb) {
  var now = new Date();

  clientModel.create({
    id: sha1(name + now.toString()),
    type: type,
    name: name,
    secret: sha1(name + now.toString() + name + name),
    creationDate: now,
    activated: activated
  }, cb);
};

var clientModel = mongoose.model('client', clientSchema);

module.exports = clientModel;