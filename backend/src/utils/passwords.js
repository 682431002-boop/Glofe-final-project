'use strict';
const bcrypt = require('bcryptjs');
const { loadEnv } = require('../config/env');

/** bcrypt hash with a per-password random salt (cost factor from BCRYPT_ROUNDS, default 12). */
function hashPassword(plain) { return bcrypt.hash(plain, loadEnv().bcryptRounds); }
function verifyPassword(plain, hash) { return bcrypt.compare(plain, hash); }

// Used to spend the same time on "unknown email" as on "wrong password" (reduces user enumeration by timing).
let dummyHash;
async function getDummyHash() {
  if (!dummyHash) dummyHash = await hashPassword('glofe-timing-equalizer-not-a-real-password');
  return dummyHash;
}
module.exports = { hashPassword, verifyPassword, getDummyHash };
