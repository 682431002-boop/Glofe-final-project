'use strict';
const router = require('express').Router();
const c = require('../controllers/product.controller');

router.get('/', c.list);
router.get('/:id', c.get);

module.exports = router;
