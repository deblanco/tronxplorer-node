const { TronClient } = require('../utils/trongrpc');
const { to, ReE, ReS } = require('../utils/responseHandler');

const getWitnesses = async (req, res) => {
  const [err, fWitnesses] = await to(TronClient.getWitnesses());
  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);
  return ReS(res, { witnesses: fWitnesses });
};

const getWitness = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length === '') {
    return ReE(res, 'Must send a address as argument.');
  }
  const [err, fWitnessess] = await to(TronClient.getWitnesses());

  if (err) return ReE(res, `Error: ${JSON.stringify(err)}`);

  const witnessMatch = fWitnessess.find(witness => witness.address === address);
  return ReS(res, { witness: witnessMatch });
};

module.exports = {
  getWitnesses,
  getWitness,
};
