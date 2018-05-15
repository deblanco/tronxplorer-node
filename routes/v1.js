const express = require('express');

const router = express.Router();

const BlockController = require('./../controllers/BlockController');
const AccountController = require('./../controllers/AccountController');
const TokenController = require('./../controllers/TokenController');
const NetworkController = require('./../controllers/NetworkController');
const SearchController = require('./../controllers/SearchController');

router.get('/transactions/:address', BlockController.getTransactions);
router.get('/transactions/last/:limit', BlockController.getLastestTransactions);

router.get('/blocks/:block', BlockController.getBlock);
router.get('/blocks/last/:limit', BlockController.getLastestBlocks);

router.get('/account/:address', AccountController.getAccount);
router.get('/accounts', AccountController.getAccounts);

router.get('/witnesses', NetworkController.getWitnesses);
router.get('/witnesses/:address', NetworkController.getWitness);

router.get('/tokens', TokenController.getTokens);
router.get('/tokens/:name', TokenController.getToken);

router.get('/search', SearchController.queryFor);

module.exports = router;
