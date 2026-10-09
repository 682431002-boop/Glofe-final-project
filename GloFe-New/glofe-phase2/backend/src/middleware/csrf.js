'use strict';
const AppError = require('../utils/AppError');
const { generateToken, tokensMatch } = require('../utils/csrf');
const { SAFE_METHODS } = require('./security');

/** Returns the session's CSRF token, creating it (and therefore the session) on first use. */
function ensureCsrfToken(req) {
  if (!req.session.csrfToken) req.session.csrfToken = generateToken();
  return req.session.csrfToken;
}

/**
 * Synchronizer-token CSRF protection for every non-safe method.
 * The SPA fetches the token from GET /api/csrf-token and sends it in the X-CSRF-Token header.
 * Cookies alone are never enough to change state.
 */
function verifyCsrf(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const expected = req.session && req.session.csrfToken;
  if (!tokensMatch(expected, req.get('x-csrf-token'))) {
    return next(new AppError(403, 'CSRF_INVALID', 'Security token missing or invalid. Please refresh the page and try again.'));
  }
  next();
}

module.exports = { ensureCsrfToken, verifyCsrf };
