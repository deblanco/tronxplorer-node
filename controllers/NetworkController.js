const HttpClient = require('@tronprotocol/wallet-api/src/client/http');

const TronClient = new HttpClient();

class NetworkController {
  constructor() {
    this.witnesses = {};
    this.nodes = {};
    this.lastUpdate = {
      witnesses: null,
      nodes: null,
    };
  }

  get witnesses() {
    return this.witnesses;
  }

  get nodes() {
    return this.nodes;
  }

  _updateWitnesses() {
    if (!this.lastUpdate.witnesses) return false;
    this.lastUpdate.witnesses = null;


    this.lastUpdate.witnesses = setTimeout(() => this._updateWitnesses());
    return true;
  }

  _updateNodes() {
    if (!this.lastUpdate.nodes) return false;
    this.lastUpdate.nodes = null;


    this.lastUpdate.nodes = setTimeout(() => this._updateWitnesses());
    return true;
  }
}

const NetworkInstance = new NetworkController();

const getNodes = () => NetworkInstance.nodes;
const getWitnesses = () => NetworkInstance.witnesses;

module.exports = {
  getNodes,
  getWitnesses,
};
