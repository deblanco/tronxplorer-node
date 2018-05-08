/**
 * sync-blockchain.js
 * The purpose of the script is to read every block from TRON blockchain and storage it
 * on a Mongo database.
 *
 * Authors: Daniel Blanco, Santiago de los Santos
 */

const GrpcClient = require('@tronprotocol/wallet-api/src/client/grpc');
const mongoose = require('mongoose');
const Block = require('../models/block');

const TronClient = new GrpcClient({
  hostname: '47.254.146.147', // full node
});
const db = connect(); // connect to mongo

// init procedure
init();

async function init() {
  let lastBlockDb;
  let lastBlock;

  try {
    lastBlockDb = await Block.findOne().sort('-number') || { number: 0 };
    console.log('Last block stored:', lastBlockDb.number);
  } catch (err) {
    console.log('Error getting last block.');
    init();
    return false;
  }

  // Gets last block from tron chain
  try {
    lastBlock = await TronClient.getLatestBlock();
    console.log('Last block TRON chain:', lastBlock.number);
  } catch (err) {
    console.log('Error getting last block from database.');
    init();
    return false;
  }

  if (lastBlockDb === 0 || lastBlock.number < lastBlockDb.number) {
    dropCollection();
    lastBlockDb = -1;
  }

  for (let i = lastBlockDb.number + 1; i <= lastBlock.number; i++) {
    try {
      const block = await TronClient.getBlockByNumber(i);
      if (!block) {
        console.log(`Seems that block ${i} is empty.`);
      } else {
        console.log(`Processing block: ${block.number} (${block.transactionsList.length} tx)`);
        await storeBlock(block);
      }
    } catch (err) {
      console.log(err);
      // if there is an error then shortcircuit for-loop and start again in 1-minute
      init();
      return false;
    }
  }
  setTimeout(() => init(), 30 * 1000); // autoinvoke in 30 seconds
}

async function storeBlock(blockObject) {
  return Block.create(blockObject);
}

async function connect() {
  const mongoLocation = 'mongodb://tron_rw:tron_rw_2018@api.tronxplorer.info:27017/tronxplorer';
  await mongoose.connect(mongoLocation).catch((err) => {
    console.log('*** Can Not Connect to Mongo Server:', mongoLocation);
    throw err;
  });
  const dbi = mongoose.connection;
  dbi.once('open', () => {
    console.log(`Connected to mongo at ${mongoLocation}`);
  });
  dbi.on('error', (error) => {
    console.log('error', error);
  });
  return dbi;
}

async function dropCollection() {
  // if the blockchain has been resetted we need to drop the collection
  // remove functionality with mainnet launch to avoid errors.
  // throws 'ns not found' if collection doesn't exist... don't take care
  return Block.collection.remove({});
}
