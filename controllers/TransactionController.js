const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const { Block, Transaction } = require('./../models');
require('./../global_functions');

const SolidClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: 50051,
});

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
  port: 50051,
});

const getTransactions = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length < 35) {
    return ReE(res, 'The account must have 35 characters.');
  }
  const [txFrom, txTo] = await Promise.all([
    TronClient.getTransactionsFromThis(address),
    TronClient.getTransactionsToThis(address),
  ]);

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

  const [err, fTx] = await to(SolidClient.getTransactionById(transactionHash));

  const tx = fTx || {};
  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { transaction: tx });
};

module.exports = {
  getTransactions,
  getLastestTransactions,
  getTransaction,
};
