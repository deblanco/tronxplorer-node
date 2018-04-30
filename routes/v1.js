const express = require('express');

const router = express.Router();
const path = require('path');

const BlockController = require('./../controllers/BlockController');

router.get('/transactions/:address', BlockController.getTransactions);
router.get('/transactions/last/:limit', BlockController.getLastestTransactions);

router.get('/blocks/:block', BlockController.getBlock);
router.get('/blocks/last/:limit', BlockController.getLastestBlocks);

module.exports = router;
