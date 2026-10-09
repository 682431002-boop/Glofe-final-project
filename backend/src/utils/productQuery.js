'use strict';
/**
 * Builds the product-list SQL. Pure function so it can be tested without a database.
 * SECURITY: user text only ever goes into the params array (bound to ? placeholders).
 * ORDER BY comes from a fixed whitelist; LIMIT/OFFSET are integers validated upstream.
 */
const SORT_SQL = {
  newest: 'p.created_at DESC, p.id DESC',
  price_asc: 'p.price ASC, p.id ASC',
  price_desc: 'p.price DESC, p.id ASC',
};

// Shared by the list query and the single-product query so both return identical shapes.
const PRODUCT_SELECT = `SELECT p.id, p.name, p.description, p.price, p.currency, p.brand, p.tags,
        p.stock_quantity, p.is_preorder, p.estimated_arrival, p.created_at,
        DATE_FORMAT(p.preorder_deadline, '%Y-%m-%d') AS preorder_deadline,
        c.id AS country_id, c.code AS country_code, c.name AS country_name, c.flag_emoji AS country_flag,
        cat.id AS category_id, cat.name AS category_name, cat.slug AS category_slug,
        (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id
           ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC LIMIT 1) AS image,
        (SELECT COUNT(*) FROM product_variants v WHERE v.product_id = p.id AND v.is_active = 1) AS variant_count`;
const PRODUCT_FROM = `FROM products p
      JOIN countries c  ON c.id = p.country_id
      JOIN categories cat ON cat.id = p.category_id`;

const escapeLike = (s) => s.replace(/[\\%_]/g, (m) => '\\' + m);

function buildProductQuery(f) {
  const where = ['p.is_active = 1'];
  const params = [];

  if (f.q) {
    // Matches the original shop search: product name + tags.
    where.push('(p.name LIKE ? OR CAST(p.tags AS CHAR) LIKE ?)');
    const like = `%${escapeLike(f.q)}%`;
    params.push(like, like);
  }
  if (f.country) {
    where.push('(c.name = ? OR c.code = ?)');
    params.push(f.country, f.country.toUpperCase());
  }
  if (f.category) {
    where.push('(cat.slug = ? OR cat.name = ?)');
    params.push(f.category.toLowerCase(), f.category);
  }
  if (f.minPrice !== undefined) { where.push('p.price >= ?'); params.push(f.minPrice); }
  if (f.maxPrice !== undefined) { where.push('p.price <= ?'); params.push(f.maxPrice); }

  const whereSql = where.join(' AND ');
  const from = PRODUCT_FROM;
  const limit = Number(f.limit);
  const offset = (Number(f.page) - 1) * limit;
  if (!Number.isInteger(limit) || !Number.isInteger(offset) || limit < 1 || offset < 0) {
    throw new Error('buildProductQuery: invalid pagination');
  }

  return {
    countSql: `SELECT COUNT(*) AS total ${from} WHERE ${whereSql}`,
    listSql: `${PRODUCT_SELECT}
      ${from} WHERE ${whereSql}
      ORDER BY ${SORT_SQL[f.sort] || SORT_SQL.newest}
      LIMIT ${limit} OFFSET ${offset}`,
    params,
  };
}

module.exports = { PRODUCT_SELECT, PRODUCT_FROM, buildProductQuery, SORT_SQL, escapeLike };
