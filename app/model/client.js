var mongoose = require('mongoose');

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

var clientModel = mongoose.model('client', clientSchema);

module.exports = clientModel;