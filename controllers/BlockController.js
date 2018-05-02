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
    { $limit: 500 },
    { $unwind: '$transactions' },
    {
      $match: {
        $or: [{ 'transactions.from': address }, { 'transactions.to': address }],
      },
    },
  ]));

  if (err) return ReE(res, `No transactions found for ${address}`);
  ReS(res, { transactions: txs });
};

const getLastestTransactions = async (req, res) => {
  const limit = +req.params.limit || 10;
  const [err, txs] = await to(Block.aggregate([
    { $unwind: '$transactions' },
    { $sort: { number: -1 } },
    { $limit: limit },
  ]));

  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { transactions: txs });
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
  const [err, blcks] = await to(Block.find().sort({ number: -1 }).limit(limit));

  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { blocks: blcks });
};

module.exports = {
  getTransactions,
  getLastestTransactions,
  getBlock,
  getLastestBlocks,
};
