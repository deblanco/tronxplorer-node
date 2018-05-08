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

const getBlock = async (req, res) => {
  const { block } = req.params;
  if (!block || !Number.isInteger(+block)) {
    return ReE(res, `The block must be specified or a number: ${block}.`);
  }

  const [err, blck] = await to(Block.findOne({ number: block }));

  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { block: blck });
};

const getLastestBlocks = async (req, res) => {
  const limit = +req.params.limit || 10;
  const [err, blcks] = await to(Block.find({}).sort({ number: -1 }).limit(limit));

  const blckReduced = blcks.map((blckm) => {
    const newBlock = blckm.toObject();
    // get sum of TRX from all transactions
    newBlock.totalTrx = blckm.transactionsList.reduce((total, tx) => total + ((tx && tx.amount) ? tx.amount : 0), 0).toFixed(4);
    delete newBlock.transactionsList;
    return newBlock;
  });

  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { blocks: blckReduced });
};

module.exports = {
  getTransactions,
  getLastestTransactions,
  getBlock,
  getLastestBlocks,
};
