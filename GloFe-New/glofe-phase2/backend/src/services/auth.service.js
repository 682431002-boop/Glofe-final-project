'use strict';
const { getPool } = require('../config/db');
const AppError = require('../utils/AppError');
const { hashPassword, verifyPassword, getDummyHash } = require('../utils/passwords');

/** Only these fields are ever sent to the browser - never password_hash. */
function publicUser(row) {
  return { id: Number(row.id), name: row.name, email: row.email, role: row.role };
}

async function getUserById(id) {
  const [rows] = await getPool().execute(
    'SELECT id, name, email, role, is_active FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function register({ name, email, password }) {
  const passwordHash = await hashPassword(password);
  try {
    const [result] = await getPool().execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')",
      [name, email, passwordHash]);
    return { id: result.insertId, name, email, role: 'customer' };
  } catch (err) {
    // The UNIQUE index on users.email is the source of truth (also covers simultaneous requests).
    if (err && err.code === 'ER_DUP_ENTRY') {
      throw new AppError(409, 'EMAIL_TAKEN', 'An account with this email already exists. Try logging in instead.');
    }
    throw err;
  }
}

/** Generic failure message for unknown email, wrong password, or disabled account. */
const BAD_CREDENTIALS = () => new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');

async function authenticate(email, password) {
  const [rows] = await getPool().execute(
    'SELECT id, name, email, role, is_active, password_hash FROM users WHERE email = ? LIMIT 1', [email]);
  const user = rows[0];
  // Always run one bcrypt comparison, even for unknown emails, so timing doesn't reveal which emails exist.
  const valid = await verifyPassword(password, user ? user.password_hash : await getDummyHash());
  if (!user || !valid || !user.is_active) throw BAD_CREDENTIALS();
  await getPool().execute('UPDATE users SET last_login_at = ? WHERE id = ?', [new Date(), user.id]);
  return user;
}

module.exports = { publicUser, getUserById, register, authenticate };
