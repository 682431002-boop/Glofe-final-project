'use strict';
const express = require('express');
const session = require('express-session');
const { loadEnv } = require('./config/env');
const { getPool } = require('./config/db');
const { createMysqlStore } = require('./session/mysqlSessionStore');
const { securityHeaders, corsMiddleware, originGuard } = require('./middleware/security');
const { verifyCsrf } = require('./middleware/csrf');
const { globalLimiter } = require('./middleware/rateLimit');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

function createApp({ env = loadEnv(), pool = getPool() } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Behind a TLS-terminating proxy (production) this lets Express see the real client IP and HTTPS.
  if (env.trustProxy) app.set('trust proxy', env.trustProxy);

  app.use(securityHeaders());
  app.use(corsMiddleware(env.clientOrigins));

  // Minimal request log: method, path, status, time. Never logs bodies, headers or cookies.
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => console.log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`));
    next();
  });

  app.use(express.json({ limit: '10kb' }));

  const ttlMs = env.session.ttlHours * 3600 * 1000;
  const store = createMysqlStore({ Store: session.Store, pool, ttlMs });
  app.locals.sessionStore = store;
  app.use(session({
    name: env.session.cookieName,
    secret: env.session.secret,
    store,
    resave: false,
    saveUninitialized: false,   // no session row until we actually store something
    rolling: true,              // sliding expiration
    cookie: {
      httpOnly: true,           // JavaScript cannot read the cookie (limits XSS damage)
      secure: env.isProduction, // HTTPS-only in production
      sameSite: 'lax',
      maxAge: ttlMs,
      path: '/',
    },
  }));

  app.use('/api', globalLimiter, originGuard(env.clientOrigins), verifyCsrf, routes);
  app.use(notFoundHandler);
  app.use(errorHandler(env.isProduction));
  return app;
}

module.exports = { createApp };
