const { TronClient } = require('../utils/trongrpc');
const { Transaction, Account } = require('./../models');
require('./../global_functions');

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

const searchAccounts = async (accountString) => {;
  const [err, accs] = await to(Account.find({ address: new RegExp(`^${accountString}`, 'i') }));

  const iterations = accs.length >= LIMIT_RESULTS ? LIMIT_RESULTS : accs.length;
  const accsMaped = accs.length > 0 ? [...Array(iterations)].map((x, i) => ({
    value: accs[i].address,
    type: 'accounts',
  })) : [];
  return accsMaped;
};

const searchAccountsByName = async (accountString) => {;
  const [err, accs] = await to(Account.find({ accountName: new RegExp(`^${accountString}`, 'i') }));

  const iterations = accs.length >= LIMIT_RESULTS ? LIMIT_RESULTS : accs.length;
  const accsMaped = accs.length > 0 ? [...Array(iterations)].map((x, i) => ({
    value: accs[i].name,
    address: accs[i].address,
    type: 'accounts',
  })) : [];
  return accsMaped;
};

const searchTokens = async (tkn) => {
  const rgx = new RegExp(`^${tkn}`, 'i');
  const [err, fTokens] = await to(TronClient.getAssetIssueList());
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
  const [err, txs] = await to(Transaction.find({ hash: new RegExp(`^${txstringUp}`, 'i') }));

  const iterations = txs.length >= LIMIT_RESULTS ? LIMIT_RESULTS : txs.length;
  const txsMaped = txs.length > 0 ? [...Array(iterations)].map((x, i) => ({
    value: txs[i].hash,
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
    searchAccountsByName(queryParameter),
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
