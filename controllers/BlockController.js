require('./../global_functions');
const cache = require('memory-cache');
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
  port: CONFIG.tron_node_port,
});

const fetchBlock = async (height) => {
  const blockCached = cache.get(`block-${height}`);
  if (blockCached) {
    return blockCached;
  }
  const block = await TronClient.getBlockByNumber(height);
  cache.put(`block-${height}`, block);
  return block;
};

const getBlock = async (req, res) => {
  const { block } = req.params;
  if (!block || !Number.isInteger(+block)) {
    return ReE(res, `The block must be specified or a number: ${block}.`);
  }

  const reqPromises = [
    fetchBlock(block),
    TronClient.getLatestBlock(),
  ];
  const [err, blck] = await to(Promise.all(reqPromises));

  if (err) return ReE(res, `Error: ${err}`);

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
      const blck = await fetchBlock(i);
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
    getLastestBlocks(req, res);
  }
};

module.exports = {
  getBlock,
  getLastestBlocks,
};
