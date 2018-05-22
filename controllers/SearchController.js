const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const { Block } = require('./../models');
require('./../global_functions');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
});

const LIMIT_RESULTS = 3;

const searchBlocks = async (number) => {
  if (!Number.isInteger(+number)) return [];
  const [err, lastBlock] = await to(TronClient.getLatestBlock());
  if (err) throw err;
  const arrayReturn = [];
  if (number < lastBlock.number) {
    const nines9 = lastBlock.number.toString().length - number.toString().length;
    if (nines9 === 0) return [{ value: +number, type: 'block' }];
    return [...Array(LIMIT_RESULTS)].map((y, i) => {
      const ninesGen = +(number + [...Array(nines9)].map(() => 9).join('')) - i;
      if (ninesGen > lastBlock.number) {
        return {
          value: lastBlock.number - i,
          type: 'blocks',
        };
      }
      return {
        value: +(number + [...Array(nines9)].map(() => 9).join('')) - i,
        type: 'blocks',
      };
    });
  }
  return arrayReturn;
};

const searchAccounts = async address =>
  // const rgx = new RegExp(`^${address}`, 'i');
  // const [err, fAccounts] = await to(TronClient.getAccounts());
  // const accountsFiltered = fAccounts.filter(acc1 => rgx.test(acc1.address));
  // const accountsMapped = accountsFiltered.length > 0 ? [...Array(LIMIT_RESULTS)].map((x, i) => {
  //   return {
  //     value: accountsFiltered[i].address,
  //     type: 'account',
  //   };
  // }) : [];
  // return accountsMapped;
  [];

const searchTokens = async (tkn) => {
  const rgx = new RegExp(`^${tkn}`, 'i');
  const [err, fTokens] = await to(TronClient.getAssets());
  const assetsFiltered = fTokens.filter(tknx => rgx.test(tknx.name));
  const iterations = assetsFiltered.length >= LIMIT_RESULTS ? LIMIT_RESULTS : assetsFiltered.length;
  const assetsMaped = assetsFiltered.length > 0 ? [...Array(iterations)].map((x, i) => ({
    value: assetsFiltered[i].name,
    type: 'tokens',
  })) : [];
  return assetsMaped;
};

const searchTx = async (txstring) => {
  const txstringUp = txstring.toUpperCase();
  const [err, txs] = await to(Block.aggregate([
    { $sort: { number: -1 } },
    { $unwind: '$transactionsList' },
    {
      $match:
        { 'transactionsList.hash': txstring },
    }]));

  const iterations = txs.length >= LIMIT_RESULTS ? LIMIT_RESULTS : txs.length;
  const txsMaped = txs.length > 0 ? [...Array(iterations)].map((x, i) => ({
    value: txs[i].transactionsList.hash,
    type: 'transactions',
  })) : [];
  return txsMaped;
};

const queryFor = async (req, res) => {
  const queryParameter = req.query.string;
  // validation
  if (!queryParameter || queryParameter.length === 0) return ReE(res, 'Query string is empty');

  const promisesArr = [
    searchBlocks(queryParameter),
    searchAccounts(queryParameter),
    searchTokens(queryParameter),
    searchTx(queryParameter),
  ];

  try {
    const results = await Promise.all(promisesArr);
    const outputConcat = Array.prototype.concat(...results);
    ReS(res, { matches: outputConcat });
  } catch (err) {
    return ReE(res, err);
  }
};

module.exports = {
  queryFor,
};
