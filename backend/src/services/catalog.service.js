'use strict';
const { getPool } = require('../config/db');

async function listCategories() {
  const [rows] = await getPool().execute(
    `SELECT cat.id, cat.name, cat.slug, COUNT(p.id) AS product_count
       FROM categories cat
       LEFT JOIN products p ON p.category_id = cat.id AND p.is_active = 1
      GROUP BY cat.id, cat.name, cat.slug
      ORDER BY cat.id`);
  return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, productCount: Number(r.product_count) }));
}

/** type: 'origin' (where products come from), 'shipping' (where GloFe ships), or undefined (all). */
async function listCountries(type) {
  let where = 'is_active = 1';
  if (type === 'origin') where += ' AND is_origin = 1';
  if (type === 'shipping') where += ' AND is_shipping_destination = 1';
  const [rows] = await getPool().execute(
    `SELECT id, code, name, flag_emoji, is_origin, is_shipping_destination, shipping_fee
       FROM countries WHERE ${where} ORDER BY id`); // `where` is built only from the fixed strings above
  return rows.map((r) => ({
    id: r.id, code: r.code, name: r.name, flag: r.flag_emoji,
    isOrigin: !!r.is_origin, isShippingDestination: !!r.is_shipping_destination,
    shippingFee: Number(r.shipping_fee),
  }));
}

module.exports = { listCategories, listCountries };
