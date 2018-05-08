require('./../global_functions');
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
});

const getTokens = async (req, res) => {
  const [err, fTokens] = await to(TronClient.getAssets());
  return ReS(res, { tokens: fTokens });
};

const getToken = async (req, res) => {
  const { name } = req.params;
  // validation
  if (!name || name.length === '') {
    return ReE(res, 'Must send a name as argument.');
  }
  const [err, fTokens] = await to(TronClient.getAssets());
  const tokenMatch = fTokens.find(token => token.name === name);
  return ReS(res, { token: tokenMatch });
};

module.exports = {
  getTokens,
  getToken,
};
