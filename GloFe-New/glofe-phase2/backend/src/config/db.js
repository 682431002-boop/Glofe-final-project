'use strict';
const mysql = require('mysql2/promise');
const { loadEnv } = require('./env');

let pool;

/** Shared connection pool. All queries use placeholders (?) - never string concatenation of user input. */
function getPool() {
  if (pool) return pool;
  const { db } = loadEnv();
  pool = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
    connectionLimit: db.connectionLimit,
    waitForConnections: true,
    charset: 'utf8mb4',
    timezone: 'Z',               // JS Dates are exchanged as UTC
    multipleStatements: false,   // blocks stacked-query injection
  });
  // Make NOW()/CURRENT_TIMESTAMP default columns UTC on every connection.
  pool.pool.on('connection', (conn) => conn.query("SET time_zone = '+00:00'"));
  return pool;
}

/** Runs fn(connection) inside a transaction (used by checkout in a later phase). */
async function withTransaction(fn) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function closePool() {
  if (pool) { await pool.end(); pool = undefined; }
}

module.exports = { getPool, withTransaction, closePool };
