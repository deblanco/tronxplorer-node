const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');
const { Transaction } = require('./../models');
require('./../global_functions');

const SolidClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

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

  const lastBlock = await SolidClient.getLatestBlock();
  const lastTxs = [];
  let i = 0;

  while (lastTxs.length < limit) {
    const blck = i === 0 ? lastBlock : await SolidClient.getBlockByNumber(lastBlock.number - i);
    blck.transactionsList.forEach((tx) => {
      if (lastTxs.length < limit) {
        const txi = tx;
        txi.block = blck.number;
        lastTxs.push(txi);
      }
    });
    i += 1;
  }
  ReS(res, { transactions: lastTxs });
};

const getTransactionList = async (req, res) => {
  const limit = +req.params.limit || 1000;

  const [err, fTxs] = await to(Transaction.find({}).sort({ block: -1 }).limit(limit));
  const txs = fTxs || [];
  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { transaction: txs });
};

const getTransaction = async (req, res) => {
  const { transactionHash } = req.params;
  if (!transactionHash) {
    return ReE(res, 'The transaction\'s hash must be specified.');
  }

  const [err, fTx] = await to(SolidClient.getTransactionById(transactionHash));
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
