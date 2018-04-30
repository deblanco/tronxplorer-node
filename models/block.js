const mongoose = require('mongoose');

const BlockSchema = mongoose.Schema({
  contractType: {
    ASSETISSUECONTRACT: Number,
    DEPLOYCONTRACT: Number,
    PARTICIPATEASSETISSUECONTRACT: Number,
    TRANSFERASSETCONTRACT: Number,
    TRANSFERCONTRACT: Number,
    VOTEASSETCONTRACT: Number,
    VOTEWITNESSCONTRACT: Number,
    WITNESSCREATECONTRACT: Number,
    WITNESSUPDATECONTRACT: Number,
  },
  number: Number,
  parentHash: String,
  size: Number,
  time: Number,
  totalTrx: Number,
  transactions: [{
    amount: Number,
    from: String,
    to: String,
  }],
  transactionsCount: Number,
  witnessAddress: String,
});

BlockSchema.methods.toWeb = () => {
  const json = this.toJSON();
  json.id = this._id;// this is for the front end
  return json;
};

module.exports = mongoose.model('Block', BlockSchema);
