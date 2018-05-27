require('./../global_functions');
const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');

const TronClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

const getTokens = async (req, res) => {
  const [err, fTokens] = await to(TronClient.getAssetIssueList());
  return ReS(res, { tokens: fTokens });
};

const getToken = async (req, res) => {
  const { name } = req.params;
  // validation
  if (!name || name.length === '') {
    return ReE(res, 'Must send a name as argument.');
  }
  const [err, fTokens] = await to(TronClient.getAssetIssueByName(name));
  return ReS(res, { token: fTokens });
};

module.exports = {
  getTokens,
  getToken,
};
