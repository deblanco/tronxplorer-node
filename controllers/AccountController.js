require("./../global_functions");
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
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
  const [err, fAccounts] = await to(TronClient.getAccounts());
  ReS(res, { accounts: fAccounts });
};

module.exports = {
  getAccount,
  getAccounts,
};
