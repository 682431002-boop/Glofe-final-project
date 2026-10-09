'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRegister, parseLogin, parseProductQuery, parseIdParam, passwordProblem } = require('../src/utils/validation');

const expectValidation = (fn, field) => {
  assert.throws(fn, (e) => e.statusCode === 422 && e.details && field in e.details, `expected validation error on ${field}`);
};

test('register: accepts valid input and normalises email/name', () => {
  const r = parseRegister({ name: '  Somchai   Jaidee ', email: ' Somchai@Example.COM ', password: 'Sunshine2026x', confirmPassword: 'Sunshine2026x' });
  assert.deepEqual(r, { name: 'Somchai Jaidee', email: 'somchai@example.com', password: 'Sunshine2026x' });
});
test('register: accepts Thai names', () => {
  assert.equal(parseRegister({ name: 'สมชาย ใจดี', email: 'a@b.co', password: 'Sunshine2026x' }).name, 'สมชาย ใจดี');
});
test('register: rejects HTML in name (XSS defence in depth)', () => {
  expectValidation(() => parseRegister({ name: '<script>alert(1)</script>', email: 'a@b.co', password: 'Sunshine2026x' }), 'name');
});
test('register: rejects bad emails', () => {
  for (const email of ['', 'nope', 'a@b', 'a b@c.com', 'a@@b.com', '<x>@b.com', 'a'.repeat(250) + '@b.com']) {
    expectValidation(() => parseRegister({ name: 'Ann', email, password: 'Sunshine2026x' }), 'email');
  }
});
test('register: password policy', () => {
  assert.match(passwordProblem('short1'), /at least 10/);
  assert.match(passwordProblem('onlyletterspassword'), /letter and one number/);
  assert.match(passwordProblem('12345678901234'), /letter and one number/);
  assert.match(passwordProblem('Password123'), /too common/);
  assert.match(passwordProblem('a1'.repeat(40)), /too long/);
  assert.match(passwordProblem('a@b.com12345', 'a@b.com12345'), /same as your email/);
  assert.equal(passwordProblem('Sunshine2026x'), null);
  assert.match(passwordProblem('Sunshine2026x', undefined, 20), /at least 20/);
});
test('register: confirmPassword mismatch is rejected', () => {
  expectValidation(() => parseRegister({ name: 'Ann', email: 'a@b.co', password: 'Sunshine2026x', confirmPassword: 'different1' }), 'confirmPassword');
});
test('register: non-object bodies are rejected with 400', () => {
  for (const body of [null, undefined, 'x', 5, [], ]) assert.throws(() => parseRegister(body), (e) => e.statusCode === 400);
});
test('register: non-string password types cannot slip through', () => {
  expectValidation(() => parseRegister({ name: 'Ann', email: 'a@b.co', password: { $ne: 1 } }), 'password');
  expectValidation(() => parseRegister({ name: 'Ann', email: 'a@b.co', password: ['Sunshine2026x'] }), 'password');
});
test('login: validates and lowercases email', () => {
  assert.deepEqual(parseLogin({ email: 'A@B.CO', password: 'x' }), { email: 'a@b.co', password: 'x' });
  expectValidation(() => parseLogin({ email: 'a@b.co', password: '' }), 'password');
  expectValidation(() => parseLogin({ email: 'bad', password: 'x' }), 'email');
});

test('product query: defaults', () => {
  assert.deepEqual(parseProductQuery({}), { q: '', country: '', category: '', minPrice: undefined, maxPrice: undefined, sort: 'newest', page: 1, limit: 12 });
});
test('product query: valid filters', () => {
  const r = parseProductQuery({ q: ' bag ', country: 'Korea', category: 'bags', minPrice: '500', maxPrice: '3000.50', sort: 'price_asc', page: '2', limit: '24' });
  assert.equal(r.q, 'bag'); assert.equal(r.minPrice, 500); assert.equal(r.maxPrice, 3000.5); assert.equal(r.page, 2); assert.equal(r.limit, 24);
});
test('product query: rejects bad values', () => {
  expectValidation(() => parseProductQuery({ sort: 'price; DROP TABLE users' }), 'sort');
  expectValidation(() => parseProductQuery({ page: '0' }), 'page');
  expectValidation(() => parseProductQuery({ page: '-1' }), 'page');
  expectValidation(() => parseProductQuery({ limit: '1000' }), 'limit');
  expectValidation(() => parseProductQuery({ minPrice: 'abc' }), 'minPrice');
  expectValidation(() => parseProductQuery({ minPrice: '500', maxPrice: '100' }), 'minPrice');
});
test('product query: array/object query values (?q[]=x) do not crash or pass through', () => {
  assert.equal(parseProductQuery({ q: ['a', 'b'] }).q, '');
  expectValidation(() => parseProductQuery({ page: ['1'] }), 'page');
});
test('id param: only positive integers', () => {
  assert.equal(parseIdParam('12'), '12');
  for (const bad of ['0', '-1', '1.5', 'abc', '1 OR 1=1', '', '01', '9'.repeat(30)]) {
    assert.throws(() => parseIdParam(bad), (e) => e.statusCode === 404);
  }
});
