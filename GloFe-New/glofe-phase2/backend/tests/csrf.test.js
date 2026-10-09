'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { generateToken, tokensMatch } = require('../src/utils/csrf');

test('tokens are 64 hex chars and unique', () => {
  const a = generateToken(), b = generateToken();
  assert.match(a, /^[0-9a-f]{64}$/); assert.notEqual(a, b);
});
test('tokensMatch: equal tokens match', () => { const t = generateToken(); assert.equal(tokensMatch(t, t), true); });
test('tokensMatch: rejects missing, wrong, different-length and non-string values', () => {
  const t = generateToken();
  for (const bad of [undefined, null, '', 'abc', t.slice(1), t + 'x', 123, {}, [t]]) assert.equal(tokensMatch(t, bad), false);
  assert.equal(tokensMatch(undefined, undefined), false);
  assert.equal(tokensMatch('', ''), false);
});
