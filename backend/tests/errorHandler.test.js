'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const AppError = require('../src/utils/AppError');
const { errorHandler } = require('../src/middleware/errorHandler');
const { ok } = require('../src/utils/response');

function fakeRes() {
  return { headersSent: false, statusCode: 200, body: undefined,
    status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
}
const silent = { error() {} };
const run = (err, prod = true) => { const res = fakeRes(); errorHandler(prod, silent)(err, { method: 'POST', path: '/x' }, res, () => {}); return res; };

test('AppError -> its status and the standard envelope', () => {
  const res = run(AppError.validation({ email: 'bad' }));
  assert.equal(res.statusCode, 422);
  assert.deepEqual(res.body, { success: false, error: { code: 'VALIDATION_ERROR', message: 'Please correct the highlighted fields.', details: { email: 'bad' } } });
});
test('unknown errors become a generic 500 with no internals', () => {
  const res = run(Object.assign(new Error("SELECT * FROM users WHERE password='hunter2' failed"), { code: 'ER_PARSE_ERROR' }));
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.error.code, 'INTERNAL_ERROR');
  assert.ok(!JSON.stringify(res.body).includes('hunter2'));
});
test('malformed JSON -> 400, oversized body -> 413', () => {
  assert.equal(run(Object.assign(new SyntaxError('x'), { type: 'entity.parse.failed' })).statusCode, 400);
  assert.equal(run(Object.assign(new Error('x'), { type: 'entity.too.large' })).statusCode, 413);
});
test('logger receives no request body (only method/path + error info)', () => {
  const logged = [];
  const res = fakeRes();
  errorHandler(true, { error: (...a) => logged.push(a.join(' ') + JSON.stringify(a)) })(new Error('boom'), { method: 'POST', path: '/api/auth/login', body: { password: 'secret123' } }, res, () => {});
  assert.ok(!logged.join('').includes('secret123'));
});
test('ok() envelope', () => {
  const res = fakeRes(); ok(res, { a: 1 }, { status: 201, meta: { total: 1 } });
  assert.equal(res.statusCode, 201); assert.deepEqual(res.body, { success: true, data: { a: 1 }, meta: { total: 1 } });
});
