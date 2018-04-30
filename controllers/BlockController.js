const { Block } = require('./../models');
require('./../global_functions');

const getTransactions = async (req, res) => {
  const { params } = req;
  // validation
  if (!params.address || params.address.length < 35) {
    ReE(res, 'Account has to have 35 characters.');
  }
};

module.exports = {
  getTransactions,
};
