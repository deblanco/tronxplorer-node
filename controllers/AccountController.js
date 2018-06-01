const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const { Account } = require('./../models');
require('./../global_functions');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
  port: CONFIG.tron_node_port,
});

const getAccount = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length !== 34) {
    return ReE(res, 'The account must have 34 characters.');
  }
  const [err, fAccount] = await to(TronClient.getAccount(address));
  ReS(res, { account: fAccount });
};

const getAccounts = async (req, res) => {
  const [err, fAccounts] = await to(Account.find({}));
  ReS(res, { accounts: fAccounts });
};

module.exports = {
  getAccount,
  getAccounts,
};
