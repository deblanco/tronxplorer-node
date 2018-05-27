/**
 * sync-blockchain.js
 * The purpose of the script is to read every block from TRON blockchain and storage it
 * on a Mongo database.
 *
 * Authors: Daniel Blanco, Santiago de los Santos
 */

const SolidityClient = require('@tronprotocol/wallet-api/src/client/solidity_grpc');
const mongoose = require('mongoose');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

const TronClient = new SolidityClient({
  hostname: 'arrimadas.tronxplorer.info',
  port: 50051,
});
const db = connect(); // connect to mongo

// init procedure
init();

async function init() {
  let lastBlockDb;
  let lastBlock;

  console.log(`${new Date().toISOString()} Syncing...`);

  try {
    lastBlockDb = await Transaction.findOne().sort('-block') || { block: 0 };
    console.log('Last block stored:', lastBlockDb.block);
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

  if (lastBlockDb === 0 || lastBlock.number < lastBlockDb.block) {
    dropCollection();
    lastBlockDb = -1;
  }

  for (let i = lastBlockDb.block + 1; i <= lastBlock.number; i++) {
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
  const operations = [];
  const transactions = blockObject.transactionsList.filter(x => !!x);
  transactions.forEach((tx) => {
    // TRANSACTION
    operations.push(Transaction.create({
      ...tx,
      block: blockObject.number,
    }));
    // FROM
    if (tx.from && tx.from.length > 0) {
      operations.push(Account.findOneAndUpdate({ address: tx.from }, TronClient.getAccount(tx.from), { upsert: true }));
    }
    // TO
    if (tx.to && tx.to.length > 0) {
      operations.push(Account.findOneAndUpdate({ address: tx.to }, TronClient.getAccount(tx.to), { upsert: true }));
    }
  });

  for (let i = 0; i <= operations.length; i++) {
    await operations[i];
  }
}

async function connect() {
  const mongoLocation = 'mongodb://tronxplorer:tron_rw@api.tronxplorer.info:27017/tronxplorer';
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
  Transaction.collection.remove({});
  Account.collection.remove({});
}
