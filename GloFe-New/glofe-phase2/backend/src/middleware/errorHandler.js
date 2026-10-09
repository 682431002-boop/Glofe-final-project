'use strict';
const AppError = require('../utils/AppError');
const { fail } = require('../utils/response');

function notFoundHandler(req, _res, next) {
  next(AppError.notFound(`Route not found: ${req.method} ${req.path}`));
}

/**
 * Central error handler -> consistent JSON. Never leaks stack traces, SQL or internals to clients.
 * Never logs request bodies, headers or cookies (they may contain passwords or session IDs).
 */
function errorHandler(isProduction, logger = console) {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, _next) => {
    if (res.headersSent) return;

    if (err instanceof AppError) {
      return fail(res, err.statusCode, err.code, err.message, err.details);
    }
    // body-parser errors
    if (err && err.type === 'entity.parse.failed') return fail(res, 400, 'BAD_JSON', 'Request body is not valid JSON.');
    if (err && err.type === 'entity.too.large') return fail(res, 413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');

    const info = { name: err && err.name, code: err && err.code, message: err && err.message };
    logger.error(`[error] ${req.method} ${req.path}`, isProduction ? info : (err && err.stack) || info);
    return fail(res, 500, 'INTERNAL_ERROR', 'Something went wrong on our side. Please try again later.');
  };
}

module.exports = { notFoundHandler, errorHandler };
