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

router.get('/transaction/:transactionHash', cache('1 day'), TransactionController.getTransaction);
router.get('/transactions/:address', cache('1 minute'), TransactionController.getTransactions);
router.get('/transactions/last/:limit', cache('15 seconds'), TransactionController.getLastestTransactions);
router.get('/transactions/list/:limit', cache('15 seconds'), TransactionController.getTransactionList);

router.get('/blocks/:block', cache('1 day'), BlockController.getBlock);
router.get('/blocks/last/:limit', cache('15 seconds'), BlockController.getLastestBlocks);

router.get('/account/:address', cache('1 minute'), AccountController.getAccount);
router.get('/accounts', cache('15 seconds'), AccountController.getAccounts);

router.get('/witnesses', cache('15 seconds'), NetworkController.getWitnesses);
router.get('/witnesses/:address', cache('2 hours'), NetworkController.getWitness);

router.get('/tokens', cache('15 seconds'), TokenController.getTokens);
router.get('/tokens/:name', cache('2 hours'), TokenController.getToken);

router.get('/search', SearchController.queryFor);

module.exports = router;
