require('./../global_functions');
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
});

const getNodes = async (req, res) => {
  const [err, fNodes] = await to(TronClient.getNodes());
  return ReS(res, { nodes: fNodes });
};

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
  getNodes,
  getWitnesses,
  getWitness,
};
