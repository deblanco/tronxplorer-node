require('./../global_functions');
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
  port: CONFIG.tron_node_port,
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
