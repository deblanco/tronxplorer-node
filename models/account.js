const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  address: String,
  accountName: String,
});

module.exports = mongoose.model('Account', AccountSchema);
