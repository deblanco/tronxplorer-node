const { Block } = require('./../models');
require('./../global_functions');

const getBlock = async (req, res) => {
  const { block } = req.params;
  if (!block || !Number.isInteger(+block)) {
    return ReE(res, `The block must be specified or a number: ${block}.`);
  }
  const blockPromises = [Block.findOne({ number: block }), Block.findOne({ number: +block + 1 })];
  const [err, blck] = await to(Promise.all(blockPromises));

  const computeBlock = blck[0].toJSON();
  computeBlock.previous = block - 1;
  computeBlock.next = blck[1] ? +block + 1 : null;

  delete computeBlock['_id'];
  delete computeBlock['__v'];

  if (err) return ReE(res, `Error: ${err}`);
  ReS(res, { block: computeBlock });
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
  getBlock,
  getLastestBlocks,
};
