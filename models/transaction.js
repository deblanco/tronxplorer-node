const mongoose = require('mongoose');

const TransanctionSchema = mongoose.Schema({
  amount: Number,
  from: String,
  to: String,
  hash: String,
  time: Number,
  data: String,
  scripts: String,
  block: Number,
});

module.exports = mongoose.model('Transaction', TransanctionSchema);
