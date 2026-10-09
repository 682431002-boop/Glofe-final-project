'use strict';
const helmet = require('helmet');
const cors = require('cors');
const AppError = require('../utils/AppError');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function securityHeaders() {
  // Defaults include: CSP, X-Content-Type-Options, Referrer-Policy, HSTS (HTTPS only), removes X-Powered-By.
  return helmet({
    crossOriginResourcePolicy: { policy: 'same-site' },
  });
}

function corsMiddleware(allowedOrigins) {
  return cors({
    origin(origin, cb) { cb(null, !origin || allowedOrigins.includes(origin)); },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
    maxAge: 600,
  });
}

/** Defence in depth: browsers always send Origin on cross-site writes - reject unknown ones. */
function originGuard(allowedOrigins) {
  return (req, _res, next) => {
    const origin = req.get('origin');
    if (!SAFE_METHODS.has(req.method) && origin && !allowedOrigins.includes(origin)) {
      return next(new AppError(403, 'ORIGIN_NOT_ALLOWED', 'Request origin is not allowed.'));
    }
    next();
  };
}

/** Auth responses must never be cached by browsers or proxies. */
function noStore(_req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}

module.exports = { securityHeaders, corsMiddleware, originGuard, noStore, SAFE_METHODS };
