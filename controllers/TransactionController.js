const { Block } = require('./../models');
require('./../global_functions');

const getTransactions = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length < 35) {
    return ReE(res, 'The account must have 35 characters.');
  }
  const [err, txs] = await to(Block.aggregate([
    { $sort: { number: -1 } },
    { $unwind: '$transactionsList' },
    {
      $match: {
        $or: [{ 'transactionsList.from': address }, { 'transactionsList.to': address }],
      },
    },
    { $limit: 1000 },
  ]));

  const mapTxs = txs.map((btx) => {
    const btxIsolated = btx.transactionsList;
    btxIsolated.block = btx.number;
    btxIsolated.time = btx.time;
    return btxIsolated;
  });

  if (err) return ReE(res, `No transactions found for ${address}`);
  ReS(res, { transactions: mapTxs });
};

const getLastestTransactions = async (req, res) => {
  const limit = +req.params.limit || 10;
  const [err, txs] = await to(Block.aggregate([
    { $sort: { number: -1 } },
    { $unwind: '$transactionsList' },
    { $limit: limit },
  ]));

  // sometimes TX comes empty?? testnet?
  const mapTxs = txs.filter(x => !!x.transactionsList).map((btx) => {
    const btxIsolated = btx.transactionsList;
    btxIsolated.block = btx.number;
    btxIsolated.time = btx.time;
    return btxIsolated;
  });

  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  ReS(res, { transactions: mapTxs });
};

const getTransaction = async (req, res) => {
  const { transactionHash } = req.params;
  if (!transactionHash) {
    return ReE(res, 'The transaction\'s hash must be specified.');
  }

  const [err, fTx] = await to(Block.aggregate([
    { $unwind: '$transactionsList' },
    { $match:
        { 'transactionsList.hash': transactionHash },
    }]));

  const tx = fTx[0] || [];
  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { transaction: tx });
};

module.exports = {
  getTransactions,
  getLastestTransactions,
  getTransaction,
};
