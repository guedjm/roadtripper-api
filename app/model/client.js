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

var clientModel = mongoose.model('client', clientSchema);

module.exports = clientModel;