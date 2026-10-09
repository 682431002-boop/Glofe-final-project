'use strict';
const rateLimit = require('express-rate-limit');
const { fail } = require('../utils/response');

/**
 * Rate limiters (in-memory store: fine for one Node process; use a shared store such as Redis
 * if you ever run several instances).
 */
function make({ windowMs, limit, message, keyGenerator, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs, limit, standardHeaders: 'draft-7', legacyHeaders: false, skipSuccessfulRequests,
    ...(keyGenerator ? { keyGenerator } : {}),
    handler: (_req, res) => fail(res, 429, 'RATE_LIMITED', message),
  });
}

const globalLimiter = make({
  windowMs: 15 * 60 * 1000, limit: 600,
  message: 'Too many requests. Please slow down and try again shortly.',
});

// 10 failed logins per 15 minutes per IP + email combination (successful logins are not counted).
const loginLimiter = make({
  windowMs: 15 * 60 * 1000, limit: 10, skipSuccessfulRequests: true,
  keyGenerator: (req) => `${req.ip}|${String((req.body && req.body.email) || '').toLowerCase().slice(0, 254)}`,
  message: 'Too many login attempts. Please wait 15 minutes and try again.',
});

const registerLimiter = make({
  windowMs: 60 * 60 * 1000, limit: 10,
  message: 'Too many sign-up attempts from this network. Please try again later.',
});

module.exports = { globalLimiter, loginLimiter, registerLimiter };
