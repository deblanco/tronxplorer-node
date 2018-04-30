const mongoose = require("mongoose");

const TransanctionSchema = mongoose.Schema({
  amount: Number,
  from: String,
  to: String,
});

module.exports = mongoose.model('Transaction', TransanctionSchema);
