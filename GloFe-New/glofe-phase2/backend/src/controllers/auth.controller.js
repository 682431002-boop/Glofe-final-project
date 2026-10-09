'use strict';
const { ok, asyncHandler } = require('../utils/response');
const { parseRegister, parseLogin } = require('../utils/validation');
const { generateToken } = require('../utils/csrf');
const { ensureCsrfToken } = require('../middleware/csrf');
const authService = require('../services/auth.service');
const { loadEnv } = require('../config/env');

const regenerate = (req) => new Promise((res, rej) => req.session.regenerate((e) => (e ? rej(e) : res())));
const save = (req) => new Promise((res, rej) => req.session.save((e) => (e ? rej(e) : res())));
const destroy = (req) => new Promise((res, rej) => req.session.destroy((e) => (e ? rej(e) : res())));

/** New session ID on login/registration (prevents session fixation) + fresh CSRF token. */
async function startSession(req, user) {
  await regenerate(req);
  req.session.userId = Number(user.id);
  req.session.csrfToken = generateToken();
  await save(req);
}

exports.csrfToken = (req, res) => ok(res, { csrfToken: ensureCsrfToken(req) });

exports.register = asyncHandler(async (req, res) => {
  const input = parseRegister(req.body);
  const user = await authService.register(input);
  await startSession(req, user);
  ok(res, { user: authService.publicUser(user), csrfToken: req.session.csrfToken }, { status: 201 });
});

exports.login = asyncHandler(async (req, res) => {
  const input = parseLogin(req.body);
  const user = await authService.authenticate(input.email, input.password);
  await startSession(req, user);
  ok(res, { user: authService.publicUser(user), csrfToken: req.session.csrfToken });
});

exports.logout = asyncHandler(async (req, res) => {
  await destroy(req);
  res.clearCookie(loadEnv().session.cookieName, { path: '/' });
  ok(res, null);
});

/** Returns { user: null } (HTTP 200) for visitors, so the SPA can bootstrap without an error. */
exports.me = asyncHandler(async (req, res) => {
  const userId = req.session && req.session.userId;
  const user = userId ? await authService.getUserById(userId) : null;
  if (userId && (!user || !user.is_active)) await destroy(req);
  ok(res, { user: user && user.is_active ? authService.publicUser(user) : null });
});
