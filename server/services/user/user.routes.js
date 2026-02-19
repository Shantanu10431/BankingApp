const express = require('express');
const { getDashboard, getAllTransactions } = require('./user.controller');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticate, getDashboard);
router.get('/transactions', authenticate, getAllTransactions);

module.exports = router;