const { Block, Transaction } = require('./../models');
require('./../global_functions');

const getTransactions = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length < 35) {
    return ReE(res, 'The account must have 35 characters.');
  }
  const [err, txs] = await to(Transaction.find({
    $or: [{ from: address }, { to: address }],
  }).sort({ block: -1 }).limit(1000));

  if (err) return ReE(res, `No transactions found for ${address}`);
  ReS(res, { transactions: txs });
};

const getLastestTransactions = async (req, res) => {
  const limit = +req.params.limit || 10;
  const [err, txs] = await to(Transaction.find({}).sort({ block: -1 }).limit(limit));

  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  ReS(res, { transactions: txs });
};

const getTransaction = async (req, res) => {
  const { transactionHash } = req.params;
  if (!transactionHash) {
    return ReE(res, 'The transaction\'s hash must be specified.');
  }

  const [err, fTx] = await to(Transaction.find({ hash: transactionHash }));

  const tx = fTx[0] || [];
  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { transaction: tx });
};

module.exports = {
  getTransactions,
  getLastestTransactions,
  getTransaction,
};
