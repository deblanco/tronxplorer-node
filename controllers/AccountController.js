require("./../global_functions");
const HttpClient = require('@tronprotocol/wallet-api/src/client/http');

const TronClient = new HttpClient();

const getAccount = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length < 35) {
    return ReE(res, "The account must have 35 characters.");
  }
  const fAccount = await TronClient.getAccount(address);
  ReS(res, { account: fAccount });
};

module.exports = {
    getAccount,
};
