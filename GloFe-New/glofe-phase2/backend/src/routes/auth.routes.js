'use strict';
const router = require('express').Router();
const c = require('../controllers/auth.controller');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimit');
const { noStore } = require('../middleware/security');

router.use(noStore);
router.post('/register', registerLimiter, c.register);
router.post('/login', loginLimiter, c.login);
router.post('/logout', c.logout);
router.get('/me', c.me);

module.exports = router;
