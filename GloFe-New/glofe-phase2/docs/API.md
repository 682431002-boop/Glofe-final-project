# GloFe API - Phase 2 endpoints

Base URL (development): `http://localhost:4000/api`

**Response format**

```json
{ "success": true,  "data": { }, "meta": { } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": { "email": "..." } } }
```

**Authentication & CSRF.** Login creates a server-side session; the browser receives an HTTP-only cookie (`glofe.sid`).
Every request that changes state (POST/PUT/PATCH/DELETE) must send the header `X-CSRF-Token` with the token from `GET /csrf-token`
(or from the login/register response). Browser requests must use `credentials: 'include'`. After login, register and logout the
session ID changes, so use the newest token (login/register return it; after logout call `GET /csrf-token` again).

| Status | Code | Meaning |
|---|---|---|
| 400 | BAD_REQUEST / BAD_JSON | Malformed request |
| 401 | UNAUTHENTICATED / INVALID_CREDENTIALS | Not logged in / wrong email or password |
| 403 | CSRF_INVALID / ORIGIN_NOT_ALLOWED / FORBIDDEN | Security check failed / no permission |
| 404 | NOT_FOUND | Unknown route or resource |
| 409 | EMAIL_TAKEN | Email already registered |
| 413 | PAYLOAD_TOO_LARGE | Body over 10 KB |
| 422 | VALIDATION_ERROR | Field errors in `error.details` |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected error (details are never exposed) |

---

## Utility

### `GET /health` - public
Checks the API and database. `200 {"success":true,"data":{"status":"ok","database":"up"}}`, or `503 DATABASE_DOWN`.

### `GET /csrf-token` - public
`200 {"success":true,"data":{"csrfToken":"<64 hex chars>"}}`. Creates an anonymous session if none exists.

## Authentication

### `POST /auth/register` - public, CSRF required, limit 10/hour/IP
Body: `{ "name": "Somchai Jaidee", "email": "somchai@example.com", "password": "Sunshine2026x", "confirmPassword": "Sunshine2026x" }`
(`confirmPassword` optional; if sent it must match.)
Rules: name = letters/spaces/`.'-` (max 100); valid email (max 254); password 10-72 bytes with a letter and a number, not a common password.
Always creates role `customer`. Logs the user in.
`201 { "success": true, "data": { "user": { "id": 1, "name": "Somchai Jaidee", "email": "somchai@example.com", "role": "customer" }, "csrfToken": "..." } }`
Errors: `422` field errors, `409 EMAIL_TAKEN`.

### `POST /auth/login` - public, CSRF required, limit 10 failures/15 min per IP+email
Body: `{ "email": "somchai@example.com", "password": "Sunshine2026x" }`
`200` same shape as register. Error: `401 INVALID_CREDENTIALS` (identical for unknown email, wrong password, disabled account).

### `POST /auth/logout` - CSRF required
Destroys the server session and clears the cookie. `200 {"success":true,"data":null}`.

### `GET /auth/me` - public
`200 {"success":true,"data":{"user":{...}}}` when logged in, or `{"user":null}` for visitors.

## Catalog

### `GET /products` - public
Query parameters (all optional):

| Param | Example | Notes |
|---|---|---|
| `q` | `bag` | Matches product name or tags |
| `country` | `Korea` or `KR` | Country of origin (name or ISO code) |
| `category` | `clothing` | Category slug or name |
| `minPrice`, `maxPrice` | `500`, `3000` | THB |
| `sort` | `newest` (default), `price_asc`, `price_desc` | |
| `page`, `limit` | `1`, `12` | limit max 48 |

```json
{ "success": true,
  "data": [ { "id": 4, "name": "CAP MARDI BOLD LOGO_BROWN CREAM", "description": "Signature floral graphic cap in relaxed fit.",
      "price": 1350, "currency": "THB", "brand": null, "tags": ["Clothing","Fashion"],
      "country": { "id": 1, "code": "KR", "name": "Korea", "flag": "🇰🇷" },
      "category": { "id": 4, "name": "Clothing", "slug": "clothing" },
      "image": "assets/images/gap.jpg", "isPreorder": true, "preorderDeadline": "2026-10-21", "preorderOpen": true,
      "estimatedArrival": null, "stockQuantity": null, "requiresVariant": false, "createdAt": "..." } ],
  "meta": { "page": 1, "limit": 12, "total": 16, "totalPages": 2 } }
```
Only active products are returned. `422` for invalid parameters.

### `GET /products/:id` - public
Same fields as above plus `images: [{id, path, alt, isPrimary}]` and `variants: [{id, option, value, available}]`. `404` if missing or inactive.

### `GET /categories` - public
`{"data":[{"id":4,"name":"Clothing","slug":"clothing","productCount":4}, ...]}`

### `GET /countries?type=origin|shipping` - public
`{"data":[{"id":1,"code":"KR","name":"Korea","flag":"🇰🇷","isOrigin":true,"isShippingDestination":false,"shippingFee":0}, ...]}`

---
Not yet implemented (later phases): profile/addresses, cart, wishlist, checkout, orders, tracking, contact, admin endpoints.
