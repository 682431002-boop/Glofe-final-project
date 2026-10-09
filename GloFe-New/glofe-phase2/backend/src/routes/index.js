'use strict';
const router = require('express').Router();
const { ok, fail, asyncHandler } = require('../utils/response');
const { getPool } = require('../config/db');
const auth = require('../controllers/auth.controller');
const catalog = require('../controllers/catalog.controller');
const { noStore } = require('../middleware/security');

// Health check (also verifies the database connection; reveals no internals).
router.get('/health', asyncHandler(async (_req, res) => {
  try {
    await getPool().query('SELECT 1');
    ok(res, { status: 'ok', database: 'up' });
  } catch {
    fail(res, 503, 'DATABASE_DOWN', 'Database is not reachable.');
  }
}));

router.get('/csrf-token', noStore, auth.csrfToken);
router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.get('/categories', catalog.categories);
router.get('/countries', catalog.countries);

module.exports = router;
