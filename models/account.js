const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  address: String,
  name: String,
  createTime: Number,
});

module.exports = mongoose.model('Account', AccountSchema);
