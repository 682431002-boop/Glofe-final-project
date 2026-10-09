#!/usr/bin/env node
'use strict';
/**
 * Creates the first (or an additional) administrator account.
 *
 *   cd backend && npm run create-admin
 *
 * Security properties:
 *   - Runs only on the server's command line; there is NO public endpoint that can create an admin,
 *     and the normal registration API can only ever create role = 'customer'.
 *   - The password is typed into a hidden prompt: it is never passed as a command-line argument
 *     (which would end up in shell history / process lists) and never written to any file or log.
 *   - Admin passwords must be at least 12 characters and pass the same policy as customers.
 *   - If the email already belongs to a customer, you are asked before it is promoted
 *     (the existing password is left unchanged).
 */
const readline = require('readline');
const { loadEnv } = require('../src/config/env');
const { getPool, closePool } = require('../src/config/db');
const { hashPassword } = require('../src/utils/passwords');
const { validateName, validateEmail, passwordProblem } = require('../src/utils/validation');

const ADMIN_PASSWORD_MIN = 12;

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

/** Reads a line from the terminal without echoing it. Requires an interactive terminal. */
function askHidden(question) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    let value = '';
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\u0003') { // Ctrl+C
          stdin.setRawMode(false); stdin.pause(); stdin.removeListener('data', onData);
          process.stdout.write('\n');
          return reject(new Error('Cancelled.'));
        }
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false); stdin.pause(); stdin.removeListener('data', onData);
          process.stdout.write('\n');
          return resolve(value);
        }
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1); // backspace
        else if (ch >= ' ') value += ch;
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    console.error('This script must be run in an interactive terminal (it asks for the password without echoing it).');
    process.exit(1);
  }
  try { loadEnv(); } catch (e) { console.error('\n' + e.message + '\n'); process.exit(1); }

  console.log('\nGloFe - create administrator account\n');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const errors = {};
  const name = validateName(await ask(rl, 'Full name: '), errors);
  const email = validateEmail(await ask(rl, 'Email: '), errors);
  rl.close();
  if (errors.name || errors.email) {
    console.error('\n' + Object.values(errors).join('\n'));
    process.exit(1);
  }

  const pool = getPool();
  const [existing] = await pool.execute('SELECT id, role FROM users WHERE email = ? LIMIT 1', [email]);

  if (existing.length) {
    if (existing[0].role === 'admin') { console.log(`\n${email} is already an administrator. Nothing to do.`); return; }
    const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
    const yes = (await ask(rl2, `\n${email} is an existing customer account. Promote it to administrator? (yes/no): `)).trim().toLowerCase();
    rl2.close();
    if (yes !== 'yes') { console.log('Cancelled. No changes made.'); return; }
    await pool.execute("UPDATE users SET role = 'admin' WHERE id = ?", [existing[0].id]);
    console.log(`\nDone. ${email} is now an administrator (password unchanged).`);
    return;
  }

  const password = await askHidden(`Password (min ${ADMIN_PASSWORD_MIN} characters, input hidden): `);
  const problem = passwordProblem(password, email, ADMIN_PASSWORD_MIN);
  if (problem) { console.error('\n' + problem); process.exit(1); }
  const confirm = await askHidden('Confirm password: ');
  if (confirm !== password) { console.error('\nPasswords do not match. No account created.'); process.exit(1); }

  const hash = await hashPassword(password);
  await pool.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')", [name, email, hash]);
  console.log(`\nAdministrator created: ${name} <${email}>`);
  console.log('You can now log in with these credentials. Store the password in a password manager.');
}

main()
  .catch((err) => { console.error('\nFailed:', err.code || err.message); process.exitCode = 1; })
  .finally(() => closePool());
