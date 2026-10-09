'use strict';
const { loadEnv } = require('./config/env');

let env;
try {
  env = loadEnv();
} catch (err) {
  console.error('\n' + err.message + '\n');
  process.exit(1);
}

const { getPool, closePool } = require('./config/db');
const { createApp } = require('./app');

async function main() {
  // Fail fast with a helpful message if MySQL isn't reachable or the schema wasn't imported.
  try {
    await getPool().query('SELECT 1 FROM users LIMIT 1');
  } catch (err) {
    console.error('\nCould not use the database.');
    console.error(`  Reason: ${err.code || err.message}`);
    console.error('  Check that MySQL is running, that backend/.env matches your database user/password,');
    console.error('  and that database/schema.sql was imported. See README.md > Troubleshooting.\n');
    process.exit(1);
  }

  const app = createApp({ env, pool: getPool() });
  const server = app.listen(env.port, () => {
    console.log(`GloFe API listening on http://localhost:${env.port}  (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received - shutting down...`);
    server.close(async () => {
      app.locals.sessionStore.close();
      await closePool();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();
