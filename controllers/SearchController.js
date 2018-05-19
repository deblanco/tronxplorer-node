const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const { Block } = require('./../models');
require('./../global_functions');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
});

const LIMIT_RESULTS = 3;

const searchBlocks = async (number) => {
  if (!Number.isInteger(+number)) return [];
  const [err, lastBlockRaw] = await to(Block.find().sort({ number: -1 }).limit(1));
  const lastBlock = lastBlockRaw[0];
  if (err) throw err;
  const arrayReturn = [];
  if (number < lastBlock.number) {
    const nines9 = lastBlock.number.toString().length - number.toString().length;
    if (nines9 === 0) return [{ value: +number, type: 'block' }];
    return [...Array(LIMIT_RESULTS)].map((y, i) => {
      return {
        value: +(number + [...Array(nines9)].map(() => 9).join('')) - i,
        type: 'block',
      };
    });
  }
  return arrayReturn;
};

const searchAccounts = async (address) => {
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
  return [];
};

const searchTokens = async (tkn) => {
  const rgx = new RegExp(`^${tkn}`, 'i');
  const [err, fTokens] = await to(TronClient.getAssets());
  const assetsFiltered = fTokens.filter(tknx => rgx.test(tknx.name));
  const iterations = assetsFiltered.length >= LIMIT_RESULTS ? LIMIT_RESULTS : assetsFiltered.length;
  const assetsMaped = assetsFiltered.length > 0 ? [...Array(iterations)].map((x, i) => {
    return {
      value: assetsFiltered[i].name,
      type: 'token',
    };
  }) : [];
  return assetsMaped;
};

const queryFor = async (req, res) => {
  const queryParameter = req.query.string;
  // validation
  if (!queryParameter) return ReE(res, 'Query string is empty');

  const promisesArr = [searchBlocks(queryParameter), searchAccounts(queryParameter), searchTokens(queryParameter)];

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
