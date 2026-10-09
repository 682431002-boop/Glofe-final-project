'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildProductQuery, escapeLike } = require('../src/utils/productQuery');
const { parseProductQuery } = require('../src/utils/validation');

const placeholders = (sql) => (sql.match(/\?/g) || []).length;

test('every placeholder has a bound parameter, and no user text is in the SQL', () => {
  const evil = "x' OR '1'='1'; DROP TABLE users; --";
  const f = parseProductQuery({ q: evil, country: evil, category: evil, minPrice: '1', maxPrice: '99999' });
  const { countSql, listSql, params } = buildProductQuery(f);
  assert.equal(placeholders(countSql), params.length);
  assert.equal(placeholders(listSql), params.length);
  for (const sql of [countSql, listSql]) {
    assert.ok(!sql.includes('DROP TABLE'));
    assert.ok(!sql.includes("1'='1"));
  }
  assert.ok(params.some((p) => String(p).includes('DROP TABLE'))); // it is in params (bound), not SQL
});
test('sort is whitelisted; unknown value falls back to newest', () => {
  assert.match(buildProductQuery({ page: 1, limit: 12, sort: 'price_desc' }).listSql, /ORDER BY p\.price DESC/);
  assert.match(buildProductQuery({ page: 1, limit: 12, sort: 'anything; --' }).listSql, /ORDER BY p\.created_at DESC/);
});
test('pagination offsets', () => {
  assert.match(buildProductQuery({ page: 3, limit: 12, sort: 'newest' }).listSql, /LIMIT 12 OFFSET 24/);
});
test('invalid pagination throws instead of reaching SQL', () => {
  assert.throws(() => buildProductQuery({ page: 1, limit: '12; DROP', sort: 'newest' }));
  assert.throws(() => buildProductQuery({ page: 0, limit: 12, sort: 'newest' }));
});
test('only active products are queried', () => {
  assert.match(buildProductQuery({ page: 1, limit: 12, sort: 'newest' }).countSql, /p\.is_active = 1/);
});
test('LIKE wildcards in search text are escaped', () => {
  assert.equal(escapeLike('50%_off\\'), '50\\%\\_off\\\\');
  const { params } = buildProductQuery({ q: '100%', page: 1, limit: 12, sort: 'newest' });
  assert.equal(params[0], '%100\\%%');
});
