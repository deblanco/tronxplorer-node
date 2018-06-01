const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const ExtensionClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');

const TronClient = new GrpcClient({
  hostname: CONFIG.tron_node,
  port: CONFIG.tron_node_port,
});

const SolidityClient = new ExtensionClient({
  hostname: CONFIG.solidity_node,
  port: CONFIG.solidity_node_port,
});

module.exports = {
  TronClient,
  SolidityClient,
};
