const { TronClient } = require('../utils/trongrpc');
require('./../global_functions');

const getTokens = async (req, res) => {
  const [err, fTokens] = await to(TronClient.getAssetIssueList());
  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  return ReS(res, { tokens: fTokens });
};

const getToken = async (req, res) => {
  const { name } = req.params;
  // validation
  if (!name || name.length === '') {
    return ReE(res, 'Must send a name as argument.');
  }
  const [err, fTokens] = await to(TronClient.getAssetIssueByName(name));
  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  return ReS(res, { token: fTokens });
};

module.exports = {
  getTokens,
  getToken,
};
