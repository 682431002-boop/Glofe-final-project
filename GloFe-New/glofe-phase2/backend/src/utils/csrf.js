'use strict';
const crypto = require('crypto');

/** Random per-session CSRF token (synchronizer-token pattern). */
function generateToken() { return crypto.randomBytes(32).toString('hex'); }

/** Constant-time comparison; false for anything that is not two equal-length strings. */
function tokensMatch(expected, provided) {
  if (typeof expected !== 'string' || typeof provided !== 'string') return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}

module.exports = { generateToken, tokensMatch };
