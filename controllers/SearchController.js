const { Block } = require('./../models');
require('./../global_functions');

const searchBlocks = async (number) => {
  const [err, blocks] = await to(Block.find({ number: new RegExp(`^${number}`, 'i') }));
  if (err) return err;
  return blocks.map(blck => ({
    value: blck.number,
    type: 'block',
  }));
};

const queryFor = async (string) => {
  const promisesArr = [];
  promisesArr.push(searchBlocks(string));

  const [blocks] = await to(Promise.all(promisesArr));
};

module.exports = {
  queryFor,
};
