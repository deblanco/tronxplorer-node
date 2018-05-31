const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const { Account } = require('./../models');
const cache = require('memory-cache');
require('./../global_functions');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
  port: CONFIG.tron_node_port,
});

const fetchCache = async (strCached, asyncFn, time = 60000) => {
  const isCached = cache.get(strCached);
  if (isCached) {
    return isCached;
  }
  try {
    const fetchFn = await asyncFn;
    cache.put(strCached, fetchFn, time);
    return fetchFn;
  } catch (err) {
    console.error(err);
    return fetchCache(strCached, asyncFn, time);
  }
};

const getAccount = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length !== 34) {
    return ReE(res, 'The account must have 34 characters.');
  }
  const [err, fAccount] = await to(fetchCache(`account-${address}`, TronClient.getAccount(address)));
  ReS(res, { account: fAccount });
};

const getAccounts = async (req, res) => {
  const [err, fAccounts] = await to(fetchCache('allAccounts', Account.find({})));
  ReS(res, { accounts: fAccounts });
};

module.exports = {
  getAccount,
  getAccounts,
};
