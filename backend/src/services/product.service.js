'use strict';
const { getPool } = require('../config/db');
const { loadEnv } = require('../config/env');
const { buildProductQuery, PRODUCT_SELECT, PRODUCT_FROM } = require('../utils/productQuery');
const { todayInTimezone } = require('../utils/dates');

function parseTags(v) {
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return []; }
}

/** Maps a DB row to the public API shape. Prices are converted from DECIMAL strings to numbers for display only. */
function mapProduct(row, today) {
  const deadline = row.preorder_deadline || null;
  return {
    id: Number(row.id),
    name: row.name,
    description: row.description,
    price: Number(row.price),
    currency: row.currency,
    brand: row.brand,
    tags: parseTags(row.tags),
    country: { id: row.country_id, code: row.country_code, name: row.country_name, flag: row.country_flag },
    category: { id: row.category_id, name: row.category_name, slug: row.category_slug },
    image: row.image,
    isPreorder: !!row.is_preorder,
    preorderDeadline: deadline,
    // Deadline day is inclusive, evaluated in the business timezone (default Asia/Bangkok).
    preorderOpen: !!row.is_preorder && (!deadline || deadline >= today),
    estimatedArrival: row.estimated_arrival,
    stockQuantity: row.stock_quantity === null ? null : Number(row.stock_quantity),
    requiresVariant: Number(row.variant_count) > 0,
    createdAt: row.created_at,
  };
}

async function listProducts(filters) {
  const pool = getPool();
  const { countSql, listSql, params } = buildProductQuery(filters);
  const [[countRow]] = await pool.execute(countSql, params);
  const [rows] = await pool.execute(listSql, params);
  const today = todayInTimezone(loadEnv().businessTimezone);
  const total = Number(countRow.total);
  return {
    items: rows.map((r) => mapProduct(r, today)),
    meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.max(1, Math.ceil(total / filters.limit)) },
  };
}

async function getProduct(id) {
  const pool = getPool();
  const [rows] = await pool.execute(`${PRODUCT_SELECT} ${PRODUCT_FROM} WHERE p.id = ? AND p.is_active = 1 LIMIT 1`, [id]);
  if (!rows.length) return null;
  const [images] = await pool.execute(
    `SELECT id, image_path, alt_text, is_primary FROM product_images
      WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC`, [id]);
  const [variants] = await pool.execute(
    `SELECT id, option_name, option_value, stock_quantity FROM product_variants
      WHERE product_id = ? AND is_active = 1 ORDER BY sort_order ASC, id ASC`, [id]);
  const product = mapProduct(rows[0], todayInTimezone(loadEnv().businessTimezone));
  product.images = images.map((i) => ({ id: Number(i.id), path: i.image_path, alt: i.alt_text, isPrimary: !!i.is_primary }));
  product.variants = variants.map((v) => ({
    id: Number(v.id), option: v.option_name, value: v.option_value,
    available: v.stock_quantity === null || Number(v.stock_quantity) > 0,
  }));
  return product;
}

module.exports = { listProducts, getProduct, mapProduct };
