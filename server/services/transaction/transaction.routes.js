const express = require('express');
const { deposit, withdraw, transfer } = require('./transaction.controller');
const { validate, depositSchema, withdrawSchema, transferSchema } = require('../../middleware/validation');
const { authenticate } = require('../../middleware/auth');
const { apiLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.use(authenticate);
router.use(apiLimiter);

router.post('/deposit', validate(depositSchema), deposit);
router.post('/withdraw', validate(withdrawSchema), withdraw);
router.post('/transfer', validate(transferSchema), transfer);

module.exports = router;