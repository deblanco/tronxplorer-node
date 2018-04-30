const express = require('express');
const router = express.Router();
const path = require('path');

const BlockController = require('./../controllers/BlockController');

router.get('/transactions/:address', BlockController.getTransactions);
router.get('/transactions', BlockController.getLastestTransactions);
