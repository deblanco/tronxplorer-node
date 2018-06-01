const { TronClient, SolidityClient } = require('../utils/trongrpc');
const { Transaction } = require('./../models');
require('./../global_functions');

const fetchTransaction = async (hash) => {
  const [tx, txDb] = await Promise.all([
    TronClient.getTransactionById(hash),
    Transaction.find({ hash }),
  ]);
  if (!tx) return null;
  if (txDb[0]) {
    tx.block = txDb[0].block;
  }
  return tx;
};

const getTransactions = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length < 34) {
    return ReE(res, 'The account must have 34 characters.');
  }

  const [err, txFromTo] = await to(Promise.all([
    SolidityClient.getTransactionsFromThis(address),
    SolidityClient.getTransactionsToThis(address),
  ]));

  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);

  const txs = txFromTo[0].concat(txFromTo[1]).sort((a, b) => b.time - a.time);
  ReS(res, { transactions: txs });
};

const getLastestTransactions = async (req, res) => {
  let limit = +req.params.limit || 10;
  if (limit > 20) limit = 20;

  try {
    const findLatestHashes = await Transaction.find({}).sort({ block: -1 }).limit(limit);
    const latestTxs = [];

    let i = 0;
    for (i; i < findLatestHashes.length; i += 1) {
      const tx = await fetchTransaction(findLatestHashes[i].hash);
      if (tx) latestTxs.push(tx);
    }

    ReS(res, { transactions: latestTxs });
  } catch (err) {
    ReE(res, `Error: ${JSON.stringify(err)}`);
  }
};

const getTransactionList = async (req, res) => {
  const limit = +req.params.limit || 1000;

  const [err, fTxs] = await to(Transaction.find({}).sort({ block: -1 }).limit(limit));
  const txs = fTxs || [];
  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  ReS(res, { transactions: txs });
};

const getTransaction = async (req, res) => {
  const { transactionHash } = req.params;
  if (!transactionHash) {
    return ReE(res, 'The transaction\'s hash must be specified.');
  }

  const [err, fTx] = await to(fetchTransaction(transactionHash));
  const tx = fTx || null;
  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  ReS(res, { transaction: tx });
};

module.exports = {
  getTransactions,
  getLastestTransactions,
  getTransactionList,
  getTransaction,
};
