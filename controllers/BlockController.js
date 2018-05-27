require('./../global_functions');
const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');

const TronClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

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

  if (err) return ReE(res, `Error: ${err}`);

  blck[0].previous = blck[0].number - 1;
  blck[0].next = blck[0].number === blck[1].number ? null : blck[0].number + 1;

  ReS(res, {
    block: blck[0],
  });
};

const getLastestBlocks = async (req, res) => {
  let { limit } = req.params;
  limit = Number.isInteger(+req.params.limit) ? limit : 10;

  const latestBlock = await TronClient.getLatestBlock();
  const aPromises = [];

  [...Array(limit - 1)].forEach((x, i) => {
    aPromises.push(TronClient.getBlockByNumber(latestBlock.number - 1 - i));
  });

  const [err, response] = await to(Promise.all(aPromises));
  if (err) return ReE(res, `Error: ${err}`);

  response.unshift(latestBlock);

  ReS(res, {
    blocks: response.map((b) => {
      const hBlock = b;
      hBlock.previous = b.number - 1;
      hBlock.next = b.number === latestBlock.number ? null : b.number + 1;
      hBlock.totalTrx = b.transactionsList.reduce((total, tx) => total + ((tx && tx.amount) ? tx.amount : 0), 0).toFixed(4);
      return hBlock;
    }),
  });
};

module.exports = {
  getBlock,
  getLastestBlocks,
};
