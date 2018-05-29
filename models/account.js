const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  address: { type: String, unique: true },
  accountName: String,
});

module.exports = mongoose.model('Account', AccountSchema);
