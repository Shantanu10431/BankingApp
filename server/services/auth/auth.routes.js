const express = require('express');
const { register, login, getProfile } = require('./auth.controller');
const { validate, registerSchema, loginSchema } = require('../../middleware/validation');
const { authenticate } = require('../../middleware/auth');
const { loginLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/profile', authenticate, getProfile);

module.exports = router;