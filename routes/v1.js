const express = require('express');

const router = express.Router();
const path = require('path');

const BlockController = require('./../controllers/BlockController');
const AccountController = require('./../controllers/AccountController');

router.get('/transactions/:address', BlockController.getTransactions);
router.get('/transactions/last/:limit', BlockController.getLastestTransactions);

router.get('/blocks/:block', BlockController.getBlock);
router.get('/blocks/last/:limit', BlockController.getLastestBlocks);

router.get('/account/:address', AccountController.getAccount);

module.exports = router;
