'use strict';
/**
 * Environment configuration.
 * parseEnv() is a pure function (easy to unit-test); loadEnv() reads .env + process.env.
 * The server refuses to start with a missing/weak SESSION_SECRET or missing DB settings,
 * so insecure defaults can never reach production by accident.
 */

const PLACEHOLDER_PATTERNS = [/change[-_ ]?me/i, /replace/i, /your[-_ ]/i, /example/i, /secret$/i];

function int(raw, fallback, { min = -Infinity, max = Infinity, name } = {}) {
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(`Invalid ${name}: must be an integer between ${min} and ${max}`);
  }
  return n;
}

function parseEnv(raw) {
  const nodeEnv = raw.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';
  const errors = [];

  for (const key of ['DB_HOST', 'DB_USER', 'DB_NAME', 'SESSION_SECRET']) {
    if (!raw[key]) errors.push(`${key} is required (see backend/.env.example)`);
  }
  // DB_PASSWORD may legitimately be empty on a local dev root account, but never in production.
  if (isProduction && !raw.DB_PASSWORD) errors.push('DB_PASSWORD is required in production');

  const secret = raw.SESSION_SECRET || '';
  if (secret) {
    if (secret.length < 32) errors.push('SESSION_SECRET must be at least 32 characters');
    if (PLACEHOLDER_PATTERNS.some((re) => re.test(secret))) {
      errors.push('SESSION_SECRET still looks like a placeholder - generate a random value');
    }
  }
  if (isProduction && !raw.CLIENT_ORIGIN) errors.push('CLIENT_ORIGIN is required in production');

  let cfg;
  try {
    cfg = {
      nodeEnv,
      isProduction,
      port: int(raw.PORT, 4000, { min: 1, max: 65535, name: 'PORT' }),
      db: {
        host: raw.DB_HOST,
        port: int(raw.DB_PORT, 3306, { min: 1, max: 65535, name: 'DB_PORT' }),
        user: raw.DB_USER,
        password: raw.DB_PASSWORD || '',
        database: raw.DB_NAME,
        connectionLimit: int(raw.DB_POOL_SIZE, 10, { min: 1, max: 100, name: 'DB_POOL_SIZE' }),
      },
      session: {
        secret,
        cookieName: raw.SESSION_COOKIE_NAME || 'glofe.sid',
        ttlHours: int(raw.SESSION_TTL_HOURS, 24 * 7, { min: 1, max: 24 * 90, name: 'SESSION_TTL_HOURS' }),
      },
      clientOrigins: (raw.CLIENT_ORIGIN || 'http://localhost:5173')
        .split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean),
      trustProxy: raw.TRUST_PROXY ? int(raw.TRUST_PROXY, 0, { min: 0, max: 10, name: 'TRUST_PROXY' }) : 0,
      bcryptRounds: int(raw.BCRYPT_ROUNDS, 12, { min: 10, max: 15, name: 'BCRYPT_ROUNDS' }),
      businessTimezone: raw.BUSINESS_TIMEZONE || 'Asia/Bangkok',
    };
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length) {
    const err = new Error('Invalid configuration:\n  - ' + errors.join('\n  - '));
    err.configErrors = errors;
    throw err;
  }
  return Object.freeze(cfg);
}

let cached;
function loadEnv() {
  if (!cached) {
    require('dotenv').config(); // reads backend/.env if present; real env vars always win
    cached = parseEnv(process.env);
  }
  return cached;
}

module.exports = { parseEnv, loadEnv };
