const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  address: String,
  name: String,
});

module.exports = mongoose.model('Account', AccountSchema);
