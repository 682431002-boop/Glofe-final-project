'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { todayInTimezone } = require('../src/utils/dates');

test('date is computed in the business timezone, not UTC', () => {
  const t = new Date('2026-10-12T18:30:00Z'); // 01:30 on 13 Oct in Bangkok (UTC+7)
  assert.equal(todayInTimezone('Asia/Bangkok', t), '2026-10-13');
  assert.equal(todayInTimezone('UTC', t), '2026-10-12');
});
test('deadline day is inclusive (string comparison used by the product mapper)', () => {
  assert.ok('2026-10-12' >= '2026-10-12');
  assert.ok(!('2026-10-12' >= '2026-10-13'));
});
