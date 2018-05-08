require('./../global_functions');
const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
});

const getNodes = () => NetworkInstance.nodes;
const getWitnesses = () => NetworkInstance.witnesses;

module.exports = {
  getNodes,
  getWitnesses,
};
