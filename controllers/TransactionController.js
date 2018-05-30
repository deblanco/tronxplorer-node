const cache = require('memory-cache');
const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');
const { Transaction } = require('./../models');
require('./../global_functions');

const SolidClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

const fetchTransaction = async (hash) => {
  const txCached = cache.get(`tx-${hash}`);
  if (txCached) {
    return txCached;
  }
  const tx = await SolidClient.getTransactionById(hash);
  cache.put(`tx-${hash}`, tx);
  return tx;
};

const getTransactions = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length < 35) {
    return ReE(res, 'The account must have 35 characters.');
  }
  const [txFrom, txTo] = await Promise.all([
    SolidClient.getTransactionsFromThis(address),
    SolidClient.getTransactionsToThis(address),
  ]);

  const txs = txFrom.concat(txTo).sort((a, b) => b.time - a.time);

  ReS(res, { transactions: txs });
};

const getLastestTransactions = async (req, res) => {
  let limit = +req.params.limit || 10;
  if (limit > 20) limit = 20;

  try {
    const findLatestHashes = await Transaction.find({}).sort({ block: -1 }).limit(limit);
    const latestTxs = [];

    for (let i = 0; i < findLatestHashes.length; i += 1) {
      const tx = await fetchTransaction(findLatestHashes[i].hash);
      tx.block = findLatestHashes[i].block;
      latestTxs.push(tx);
    }

    ReS(res, { transactions: latestTxs });
  } catch (err) {
    getLastestTransactions(req, res);
  }
};

const getTransactionList = async (req, res) => {
  const limit = +req.params.limit || 1000;

  const [err, fTxs] = await to(Transaction.find({}).sort({ block: -1 }).limit(limit));
  const txs = fTxs || [];
  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { transactions: txs });
};

const getTransaction = async (req, res) => {
  const { transactionHash } = req.params;
  if (!transactionHash) {
    return ReE(res, 'The transaction\'s hash must be specified.');
  }

  const [err, fTx] = await to(fetchTransaction(transactionHash));
  const tx = fTx || null;
  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { transaction: tx });
};

module.exports = {
  getTransactions,
  getLastestTransactions,
  getTransactionList,
  getTransaction,
};
