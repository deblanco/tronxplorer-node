const { TronClient } = require('../utils/trongrpc');
const { Account } = require('./../models');
const { to, ReE, ReS } = require('../utils/responseHandler');

const getAccount = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length !== 34) {
    return ReE(res, 'The account must have 34 characters.');
  }
  const [err, fAccount] = await to(TronClient.getAccount(address));
  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  ReS(res, { account: fAccount });
};

const getAccounts = async (req, res) => {
  const [err, fAccounts] = await to(Account.find({}));
  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  ReS(res, { accounts: fAccounts });
};

module.exports = {
  getAccount,
  getAccounts,
};
