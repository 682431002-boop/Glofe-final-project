'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { createMysqlStore } = require('../src/session/mysqlSessionStore');

// Fake pool records SQL + params; real MySQL behaviour is NOT exercised here.
function fakePool(rowsToReturn = []) {
  const calls = [];
  return { calls, execute: async (sql, params) => { calls.push({ sql, params }); return [rowsToReturn]; } };
}
const wait = () => new Promise((r) => setImmediate(r));

test('set() uses placeholders and stores UTC expiry from cookie.expires', async () => {
  const pool = fakePool();
  const store = createMysqlStore({ Store: EventEmitter, pool, ttlMs: 1000 });
  const exp = new Date('2030-01-01T00:00:00Z');
  await new Promise((res) => store.set('sid1', { userId: 5, cookie: { expires: exp } }, res));
  assert.match(pool.calls[0].sql, /INSERT INTO sessions .* ON DUPLICATE KEY UPDATE/s);
  assert.equal(pool.calls[0].params[0], 'sid1');
  assert.equal(JSON.parse(pool.calls[0].params[1]).userId, 5);
  assert.equal(pool.calls[0].params[2].getTime(), exp.getTime());
  store.close();
});
test('get() returns parsed session, or null when missing/expired', async () => {
  const hit = createMysqlStore({ Store: EventEmitter, pool: fakePool([{ data: '{"userId":7}' }]), ttlMs: 1000 });
  assert.deepEqual(await new Promise((res) => hit.get('s', (_e, v) => res(v))), { userId: 7 });
  const miss = createMysqlStore({ Store: EventEmitter, pool: fakePool([]), ttlMs: 1000 });
  assert.equal(await new Promise((res) => miss.get('s', (_e, v) => res(v))), null);
  hit.close(); miss.close();
});
test('get() filters on expires_at, destroy() deletes by sid', async () => {
  const pool = fakePool();
  const store = createMysqlStore({ Store: EventEmitter, pool, ttlMs: 1000 });
  await new Promise((res) => store.get('abc', res));
  assert.match(pool.calls[0].sql, /expires_at > \?/);
  await new Promise((res) => store.destroy('abc', res));
  assert.match(pool.calls[1].sql, /DELETE FROM sessions WHERE sid = \?/);
  assert.deepEqual(pool.calls[1].params, ['abc']);
  await wait(); store.close();
});
test('corrupt session data yields an error, not a crash', async () => {
  const store = createMysqlStore({ Store: EventEmitter, pool: fakePool([{ data: '{not json' }]), ttlMs: 1000 });
  const err = await new Promise((res) => store.get('s', (e) => res(e)));
  assert.ok(err instanceof Error); store.close();
});
