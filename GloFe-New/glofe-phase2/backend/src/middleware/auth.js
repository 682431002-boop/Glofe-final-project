'use strict';
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../utils/response');
const authService = require('../services/auth.service');

/**
 * Loads the logged-in user from the database on every protected request (so deactivated
 * or demoted accounts lose access immediately) and attaches it as req.user.
 */
const requireAuth = asyncHandler(async (req, _res, next) => {
  const userId = req.session && req.session.userId;
  if (!userId) throw AppError.unauthorized();
  const user = await authService.getUserById(userId);
  if (!user || !user.is_active) {
    await new Promise((resolve) => req.session.destroy(resolve));
    throw AppError.unauthorized('Your session has expired. Please log in again.');
  }
  req.user = user;
  next();
});

/** Admin-only routes: authentication AND role are verified server-side from the database. */
const requireAdmin = [
  requireAuth,
  (req, _res, next) => (req.user.role === 'admin' ? next() : next(AppError.forbidden('Administrator access required.'))),
];

module.exports = { requireAuth, requireAdmin };
