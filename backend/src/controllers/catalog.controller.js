'use strict';
const { ok, asyncHandler } = require('../utils/response');
const AppError = require('../utils/AppError');
const catalogService = require('../services/catalog.service');

exports.categories = asyncHandler(async (_req, res) => ok(res, await catalogService.listCategories()));

exports.countries = asyncHandler(async (req, res) => {
  const { type } = req.query;
  if (type !== undefined && !['origin', 'shipping'].includes(type)) {
    throw AppError.validation({ type: "type must be 'origin' or 'shipping'." }, 'Invalid query parameters.');
  }
  ok(res, await catalogService.listCountries(type));
});
