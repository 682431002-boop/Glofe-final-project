'use strict';
/**
 * express-session store backed by the `sessions` table (sid, data, expires_at).
 * Written as a factory that receives express-session's Store base class, so it can be
 * unit-tested with a fake pool and a fake base class (no database or npm install needed).
 * All queries use ? placeholders. Dates are bound as JS Dates and stored in UTC.
 */
function createMysqlStore({ Store, pool, ttlMs, cleanupIntervalMs = 15 * 60 * 1000 }) {
  class MysqlSessionStore extends Store {
    constructor() {
      super();
      this.timer = setInterval(() => {
        this.pruneExpired().catch((e) => console.error('[session] cleanup failed:', e.code || e.message));
      }, cleanupIntervalMs);
      this.timer.unref();
    }

    _expiry(session) {
      const exp = session && session.cookie && session.cookie.expires;
      return exp ? new Date(exp) : new Date(Date.now() + ttlMs);
    }

    get(sid, cb) {
      pool.execute('SELECT data FROM sessions WHERE sid = ? AND expires_at > ?', [sid, new Date()])
        .then(([rows]) => {
          if (!rows.length) return cb(null, null);
          try { cb(null, JSON.parse(rows[0].data)); } catch (e) { cb(e); }
        })
        .catch(cb);
    }

    set(sid, session, cb = () => {}) {
      pool.execute(
        `INSERT INTO sessions (sid, data, expires_at) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE data = VALUES(data), expires_at = VALUES(expires_at)`,
        [sid, JSON.stringify(session), this._expiry(session)]
      ).then(() => cb(null)).catch(cb);
    }

    touch(sid, session, cb = () => {}) {
      pool.execute('UPDATE sessions SET expires_at = ? WHERE sid = ?', [this._expiry(session), sid])
        .then(() => cb(null)).catch(cb);
    }

    destroy(sid, cb = () => {}) {
      pool.execute('DELETE FROM sessions WHERE sid = ?', [sid]).then(() => cb(null)).catch(cb);
    }

    async pruneExpired() {
      await pool.execute('DELETE FROM sessions WHERE expires_at <= ?', [new Date()]);
    }

    close() { clearInterval(this.timer); }
  }
  return new MysqlSessionStore();
}

module.exports = { createMysqlStore };
