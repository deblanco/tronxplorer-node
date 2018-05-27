const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');
const { Account } = require('./../models');
require("./../global_functions");

const TronClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

const getAccount = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length < 35) {
    return ReE(res, "The account must have 35 characters.");
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
