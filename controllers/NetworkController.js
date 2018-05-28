require('./../global_functions');
const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');

const TronClient = new SolidityClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

const getWitnesses = async (req, res) => {
  const [err, fWitnesses] = await to(TronClient.getWitnesses());
  return ReS(res, { witnesses: fWitnesses });
};

const getWitness = async (req, res) => {
  const { address } = req.params;
  // validation
  if (!address || address.length === '') {
    return ReE(res, 'Must send a address as argument.');
  }
  const [err, fWitnessess] = await to(TronClient.getWitnesses());
  const witnessMatch = fWitnessess.find(witness => witness.address === address);
  return ReS(res, { witness: witnessMatch });
};

module.exports = {
  getWitnesses,
  getWitness,
};
