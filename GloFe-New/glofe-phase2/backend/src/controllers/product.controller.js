'use strict';
const { ok, asyncHandler } = require('../utils/response');
const AppError = require('../utils/AppError');
const { parseProductQuery, parseIdParam } = require('../utils/validation');
const productService = require('../services/product.service');

exports.list = asyncHandler(async (req, res) => {
  const filters = parseProductQuery(req.query);
  const { items, meta } = await productService.listProducts(filters);
  ok(res, items, { meta });
});

exports.get = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id, 'Product');
  const product = await productService.getProduct(id);
  if (!product) throw AppError.notFound('Product not found.');
  ok(res, product);
});
