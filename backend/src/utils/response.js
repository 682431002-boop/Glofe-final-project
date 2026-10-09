'use strict';
/** Consistent JSON envelope:  { success: true, data, meta? }  /  { success: false, error: {code, message, details?} } */
function ok(res, data = null, { status = 200, meta } = {}) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}
function fail(res, status, code, message, details) {
  const error = { code, message };
  if (details) error.details = details;
  return res.status(status).json({ success: false, error });
}
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
module.exports = { ok, fail, asyncHandler };
