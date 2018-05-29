const mongoose = require('mongoose');

const TransanctionSchema = mongoose.Schema({
  hash: String,
  block: Number,
});

TransanctionSchema.index({ block: -1 });

module.exports = mongoose.model('Transaction', TransanctionSchema);
