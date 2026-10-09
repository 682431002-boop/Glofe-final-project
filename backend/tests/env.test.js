'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseEnv } = require('../src/config/env');

const good = { DB_HOST: 'localhost', DB_USER: 'glofe_app', DB_PASSWORD: 'pw', DB_NAME: 'glofe', SESSION_SECRET: 'f3a9c1d27b8e4a60915cd2e7b34f8a01d6c5e9b2' };

test('valid config parses with safe defaults', () => {
  const c = parseEnv(good);
  assert.equal(c.port, 4000); assert.equal(c.session.cookieName, 'glofe.sid');
  assert.equal(c.isProduction, false); assert.equal(c.bcryptRounds, 12);
  assert.deepEqual(c.clientOrigins, ['http://localhost:5173']);
});
test('missing required values are reported together', () => {
  assert.throws(() => parseEnv({}), (e) => e.configErrors.length >= 4);
});
test('short or placeholder SESSION_SECRET is rejected', () => {
  assert.throws(() => parseEnv({ ...good, SESSION_SECRET: 'short' }), /at least 32/);
  assert.throws(() => parseEnv({ ...good, SESSION_SECRET: 'change-me-change-me-change-me-change-me' }), /placeholder/);
});
test('production requires DB_PASSWORD and CLIENT_ORIGIN', () => {
  assert.throws(() => parseEnv({ ...good, NODE_ENV: 'production', DB_PASSWORD: '' }), /DB_PASSWORD/);
  assert.throws(() => parseEnv({ ...good, NODE_ENV: 'production' }), /CLIENT_ORIGIN/);
  assert.equal(parseEnv({ ...good, NODE_ENV: 'production', CLIENT_ORIGIN: 'https://glofe.example/' }).clientOrigins[0], 'https://glofe.example');
});
test('numeric settings are validated', () => {
  assert.throws(() => parseEnv({ ...good, PORT: 'abc' }), /PORT/);
  assert.throws(() => parseEnv({ ...good, BCRYPT_ROUNDS: '4' }), /BCRYPT_ROUNDS/);
});
