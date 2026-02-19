const express = require('express');
const {
  getAllUsers,
  freezeAccount,
  deleteUser,
  getSystemStats,
  getAuditLogs
} = require('./admin.controller');
const { authenticate, authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', getAllUsers);
router.patch('/users/:userId/freeze', freezeAccount);
router.delete('/users/:userId', deleteUser);
router.get('/stats', getSystemStats);
router.get('/audit-logs', getAuditLogs);

module.exports = router;