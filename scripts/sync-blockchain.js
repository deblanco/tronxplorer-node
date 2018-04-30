/**
 * sync-blockchain.js
 * The purpose of the script is to read every block from TRON blockchain and storage it
 * on a Mongo database.
 *
 * Authors: Daniel Blanco, Santiago de los Santos
 */

const HttpClient = require('@tronprotocol/wallet-api/src/client/http');
const mongoose = require('mongoose');
const Block = require('../models/block');

const TronClient = new HttpClient();
const db = connect(); // connect to mongo

// init procedure
init();

async function init() {
  let lastBlockDb;
  let lastBlock;

  try {
    lastBlockDb = await Block.findOne().sort('-number') || 0;
    console.log('Last block stored:', lastBlockDb.number);
  } catch (err) {
    console.log('Error getting last block.');
    throw err;
  }

  // Gets last block from tron chain
  try {
    lastBlock = await TronClient.getLatestBlock();
    console.log('Last block TRON chain:', lastBlock.number);
  } catch (err) {
    console.log('Error getting last block from database.');
    throw err;
  }

  if (lastBlockDb === 0 || lastBlock.number < lastBlockDb.number) {
    dropCollection();
    lastBlockDb = -1;
  }

  for (let i = lastBlockDb.number + 1; i <= lastBlock.number; i++) {
    const block = await TronClient.getBlockByNum(i);
    console.log(`Processing block: ${block.number} (${block.transactions.length} tx)`);
    await storeBlock(block);
  }
  setTimeout(() => init(), 60 * 1000); // autoinvoke in 1 minute
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
  return Block.collection.drop();
}
