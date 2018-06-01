const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const { Transaction } = require('./../models');
require('./../global_functions');

const SolidClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
  port: CONFIG.tron_node_port,
});

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

    let i = 0;
    for (i; i < findLatestHashes.length; i += 1) {
      const tx = await fetchTransaction(findLatestHashes[i].hash);
      if (tx) latestTxs.push(tx);
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
