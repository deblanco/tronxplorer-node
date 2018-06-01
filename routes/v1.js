const express = require('express');
const apicache = require('apicache');

const router = express.Router();
const cache = apicache.middleware;

const BlockController = require('./../controllers/BlockController');
const AccountController = require('./../controllers/AccountController');
const TokenController = require('./../controllers/TokenController');
const NetworkController = require('./../controllers/NetworkController');
const SearchController = require('./../controllers/SearchController');
const TransactionController = require('./../controllers/TransactionController');

router.get('/transaction/:transactionHash', cache('15 seconds'), TransactionController.getTransaction);
router.get('/transactions/:address', cache('15 seconds'), TransactionController.getTransactions);
router.get('/transactions/last/:limit', cache('15 seconds'), TransactionController.getLastestTransactions);
router.get('/transactions/list/:limit', cache('15 seconds'), TransactionController.getTransactionList);

router.get('/blocks/:block', cache('15 seconds'), BlockController.getBlock);
router.get('/blocks/last/:limit', cache('15 seconds'), BlockController.getLastestBlocks);

router.get('/account/:address', cache('15 seconds'), AccountController.getAccount);
router.get('/accounts', cache('15 seconds'), AccountController.getAccounts);

router.get('/witnesses', cache('15 seconds'), NetworkController.getWitnesses);
router.get('/witnesses/:address', cache('15 seconds'), NetworkController.getWitness);

router.get('/tokens', cache('15 seconds'), TokenController.getTokens);
router.get('/tokens/:name', cache('15 seconds'), TokenController.getToken);

router.get('/search', SearchController.queryFor);

module.exports = router;
