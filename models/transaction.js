const mongoose = require('mongoose');

const TransanctionSchema = mongoose.Schema({
  hash: String,
  block: Number,
});

module.exports = mongoose.model('Transaction', TransanctionSchema);
