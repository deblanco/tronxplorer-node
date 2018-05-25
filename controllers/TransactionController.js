const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const { Block, Transaction } = require('./../models');
require('./../global_functions');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
});

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

  const lastBlock = await TronClient.getLatestBlock();
  const lastTxs = [];
  let i = 0;

  while (lastTxs.length < limit) {
    const blck = i === 0 ? lastBlock : await TronClient.getBlockByNumber(lastBlock.number - i);
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
