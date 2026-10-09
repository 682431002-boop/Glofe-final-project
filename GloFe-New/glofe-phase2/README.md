# GloFe - Global Pre-Order

Your original static site is untouched in `GloFe-New/` (and in Git history). The new full-stack version is being added in phases.

**Status: Phase 2 (backend + database).** Done: Express API, MySQL schema + seed, registration/login/logout with sessions + CSRF,
products/categories/countries endpoints, security middleware, admin-creation CLI. **Not yet built:** the Vue frontend (Phase 3), cart/wishlist/checkout/orders (Phase 4), admin dashboard (Phase 5).

```
GloFe-New/    your original project (unchanged)
backend/      Express API  (src/, scripts/, tests/, .env.example)
database/     schema.sql, seed.sql, tools/generate-seed.js
docs/         API.md, DATABASE.md, DECISIONS.md
```

## Setup on macOS (beginner steps)

Open the **Terminal** app. Run the commands one block at a time.

### 1. Install the required software
```bash
# Homebrew (skip if `brew --version` already works)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node          # Node.js 18.18 or newer (the unit tests were run on Node 22)
brew install mysql@8.4     # MySQL 8.4 LTS
brew services start mysql@8.4
```
`mysql@8.4` is "keg-only", so add it to your PATH (Apple Silicon Macs; on Intel Macs replace `/opt/homebrew` with `/usr/local`):
```bash
echo 'export PATH="/opt/homebrew/opt/mysql@8.4/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
node -v && mysql --version      # both should print a version
```

### 2. Create the database and a limited MySQL user
```bash
mysql -u root
```
At the `mysql>` prompt, type these lines (choose your own strong password; remember it for step 4):
```sql
CREATE DATABASE glofe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'glofe_app'@'localhost' IDENTIFIED BY 'CHOOSE-A-STRONG-PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON glofe.* TO 'glofe_app'@'localhost';
EXIT;
```
(The app user can read/write data but cannot drop tables. Schema import below is done as `root`.)

### 3. Import the schema and the seed data
Run from the project folder (the one containing `backend/` and `database/`):
```bash
cd /path/to/Glofe-final-project
mysql --default-character-set=utf8mb4 -u root glofe < database/schema.sql
mysql --default-character-set=utf8mb4 -u root glofe < database/seed.sql
```
Check it worked (expected: 16 products, 24 variants, 9 countries, 10 categories):
```bash
mysql -u root glofe -e "SELECT COUNT(*) AS products FROM products; SELECT COUNT(*) AS variants FROM product_variants; SELECT id,name,tags FROM products WHERE id IN (4,13);"
```
To start over: `mysql -u root -e "DROP DATABASE glofe; CREATE DATABASE glofe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"` then repeat step 3 (the app user keeps its permissions).

### 4. Configure environment variables
```bash
cd backend
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # copy the output
open -e .env                                                                  # opens in TextEdit
```
In `.env` set `DB_PASSWORD` (from step 2) and paste the generated text after `SESSION_SECRET=`. Save. **Never commit `.env`.**

### 5. Install dependencies, run the unit tests, start the API
```bash
npm install
npm run test:unit      # expected: "tests 39 / pass 39 / fail 0"
npm run dev            # expected: "GloFe API listening on http://localhost:4000 (development)"
```
Leave this Terminal window running. If the server stops immediately, read the message it prints (see Troubleshooting).

### 6. Create the first administrator (secure)
In a **second** Terminal window:
```bash
cd /path/to/Glofe-final-project/backend
npm run create-admin
```
It asks for name, email and a **hidden** password (min 12 characters, entered twice). There is no default admin and no public way to become one:
the registration API only creates customers, and this script only works on the machine that holds your `.env`.

### 7. Try the API (curl)
Still in `backend/` in the second window. `jar.txt` stores your session cookie.
```bash
curl -s http://localhost:4000/api/health                        # expect database "up"
curl -s "http://localhost:4000/api/products?country=Japan"      # 4 products
curl -s "http://localhost:4000/api/products?q=cap"              # the MARDI cap
curl -s http://localhost:4000/api/products/13                   # 4 size variants (S/M/L/XL)
curl -s http://localhost:4000/api/products/4                    # variants: [] (cap has no sizes)
curl -s http://localhost:4000/api/categories
curl -s "http://localhost:4000/api/countries?type=shipping"

# Registration + CSRF protection
TOKEN=$(curl -s -c jar.txt http://localhost:4000/api/csrf-token | node -pe "JSON.parse(require('fs').readFileSync(0)).data.csrfToken")

# Without the token -> expect 403 CSRF_INVALID
curl -s -b jar.txt -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Sunshine2026x"}'

# With the token -> expect 201 and a user object. (Registering starts a NEW session, so the
# response contains a NEW csrfToken - we capture it for the next requests.)
REG=$(curl -s -b jar.txt -c jar.txt -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" -d '{"name":"Test User","email":"test@example.com","password":"Sunshine2026x"}')
echo "$REG"
TOKEN=$(echo "$REG" | node -pe "JSON.parse(require('fs').readFileSync(0)).data.csrfToken")

curl -s -b jar.txt http://localhost:4000/api/auth/me           # expect the user

# Same email again -> expect 409 EMAIL_TAKEN
curl -s -b jar.txt -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" -d '{"name":"Test User","email":"test@example.com","password":"Sunshine2026x"}'

# Logout -> expect {"success":true,"data":null}, then /me shows {"user":null}
curl -s -b jar.txt -c jar.txt -X POST http://localhost:4000/api/auth/logout -H "X-CSRF-Token: $TOKEN"
curl -s -b jar.txt http://localhost:4000/api/auth/me

# Log back in: fetch a fresh token first, then log in -> expect 200; wrong password -> expect 401
TOKEN=$(curl -s -c jar.txt http://localhost:4000/api/csrf-token | node -pe "JSON.parse(require('fs').readFileSync(0)).data.csrfToken")
curl -s -b jar.txt -c jar.txt -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" -d '{"email":"test@example.com","password":"Sunshine2026x"}'
curl -s -b jar.txt -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" -d '{"email":"test@example.com","password":"wrong-password1"}'
```
Passwords are stored as bcrypt hashes only. You can confirm with:
`mysql -u root glofe -e "SELECT email, role, LEFT(password_hash,7) FROM users;"` (should show `$2a$12$` or similar - never the real password).

## Development vs production

| | Development | Production |
|---|---|---|
| `NODE_ENV` | `development` | `production` |
| Cookies | `secure: false` (works on http://localhost) | `secure: true` - **requires HTTPS** |
| `CLIENT_ORIGIN` | `http://localhost:5173` | your real `https://` site |
| `TRUST_PROXY` | `0` | `1` when behind a proxy that terminates HTTPS |
| Errors | stack traces in the server log only | short log lines; clients always get a generic 500 |
| Config checks | placeholder/short `SESSION_SECRET` rejected | additionally requires `DB_PASSWORD`, `CLIENT_ORIGIN` |
| Rate limiting | in-memory (single process) | use a shared store (e.g. Redis) if you run several instances |

## Troubleshooting

* **`mysql: command not found`** - redo the PATH step in 1 and open a new Terminal tab.
* **`ERROR 2002 / ECONNREFUSED`** - MySQL isn't running: `brew services start mysql@8.4`; `brew services list` should show it as started.
* **`ER_ACCESS_DENIED_ERROR`** - `DB_USER`/`DB_PASSWORD` in `backend/.env` don't match step 2. Reset with `mysql -u root -e "ALTER USER 'glofe_app'@'localhost' IDENTIFIED BY 'new-password';"`.
* **`ER_NO_SUCH_TABLE`** or "Could not use the database" - schema not imported (step 3).
* **`Invalid configuration: SESSION_SECRET ...`** - generate and paste a secret (step 4).
* **`EADDRINUSE`** - port 4000 is taken; change `PORT` in `.env` or run `lsof -i :4000`.
* **Thai filenames/descriptions look garbled in MySQL** - always import with `--default-character-set=utf8mb4`.
* **A CHECK constraint seems ignored** - you are on MySQL older than 8.0.16; use `mysql@8.4`.
* **Browser says CORS error (Phase 3)** - `CLIENT_ORIGIN` must exactly match the frontend address (scheme + host + port).

## What has and hasn't been verified

See the Phase 2 report: the unit tests in `backend/tests/` were run (39 passing), but **nothing has been run against a real MySQL server or with real npm packages installed**.
Treat steps 2-7 above as untested until you've run them, and report any error you hit.
