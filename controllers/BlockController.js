const { TronClient } = require('../utils/trongrpc');
const { to, ReE, ReS } = require('../utils/responseHandler');

const getBlock = async (req, res) => {
  const { block } = req.params;
  if (!block || !Number.isInteger(+block)) {
    return ReE(res, `The block must be specified or a number: ${block}.`);
  }

  const reqPromises = [
    TronClient.getBlockByNumber(block),
    TronClient.getLatestBlock(),
  ];
  const [err, blck] = await to(Promise.all(reqPromises));

  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);

  blck[0].previous = blck[0].number - 1;
  blck[0].next = blck[0].number === blck[1].number ? null : blck[0].number + 1;

  ReS(res, {
    block: blck[0],
  });
};

const getLastestBlocks = async (req, res) => {
  let { limit } = req.params;
  limit = Number.isInteger(+req.params.limit) || limit < 10 ? limit : 10;

  try {
    const latestBlock = await TronClient.getLatestBlock();
    const blocksFetched = [];

    for (let i = latestBlock.number - 1; blocksFetched.length < limit - 1; i -= 1) {
      const blck = await TronClient.getBlockByNumber(i);
      blocksFetched.push(blck);
    }

    blocksFetched.unshift(latestBlock);

    ReS(res, {
      blocks: blocksFetched.map((b) => {
        const hBlock = b;
        hBlock.previous = b.number - 1;
        hBlock.next = b.number === latestBlock.number ? null : b.number + 1;
        hBlock.totalTrx = b.transactionsList.reduce((total, tx) => total + ((tx && tx.amount) ? tx.amount : 0), 0).toFixed(4);
        return hBlock;
      }),
    });
  } catch (err) {
    ReE(res, `Error: ${JSON.stringify(err)}`);
  }
};

module.exports = {
  getBlock,
  getLastestBlocks,
};
