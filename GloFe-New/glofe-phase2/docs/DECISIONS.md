# Phase 2 decisions, assumptions and open questions

## Data decisions you approved (applied in `database/tools/generate-seed.js`)
1. **#4 CAP MARDI BOLD LOGO_BROWN CREAM** - sizes S-XL removed (no variants). Name, price, deadline, image, tags unchanged.
   Description: the only change is one word, "pullover" -> "cap" (original: *"Signature floral graphic pullover in relaxed fit."*).
   The image (`gap.jpg`) shows a brown cap with a flower embroidery, so "floral graphic" was kept.
2. **#13 FEAR OF GOD ESSENTIALS** - sizes S/M/L/XL kept. Tags changed from `["Fashion","Shoes"]` to `["Clothing","Fashion"]`
   (same order as the other clothing items #4, #6, #10); its primary category is therefore *Clothing*. The image (`เอส.jpg`) shows a T-shirt. Description unchanged.

Everything else (names, prices, deadlines, images, descriptions - including the unusual spacing in #1) is copied verbatim from `GloFe-New/app.js`.

## Data not in your project, therefore left empty (not invented)
`brand`, `estimated_arrival`, `stock_quantity` (all NULL); `shipping_fee` = 0.00 for every country.

## Assumptions
* Deadlines are the **last day an order is accepted**, evaluated in `Asia/Bangkok` (configurable: `BUSINESS_TIMEZONE`). The API exposes `preorderOpen`.
* **Shipping destinations** seeded from the checkout page (Thailand, Malaysia, Singapore, Indonesia, Brunei). Origin countries: Korea, Japan, China, USA.
* Product ids 1-16 are preserved, so `product.html?id=N` style links keep their meaning.
* Image paths are stored exactly as in the original (`assets/images/...`, including Thai filenames); the frontend must serve that folder (Phase 3).
* Category filter uses the primary category; free-text search also matches the full tag list (as the original search did).
* Session auth with HTTP-only cookie, `SameSite=Lax`, synchronizer-token CSRF + Origin check. Registration reveals "email already exists" (needed for usability; mitigated by rate limiting).
* Sessions live in MySQL (`sessions` table), expire after 7 days of inactivity (sliding).

## Open questions (please answer before Phase 3)
1. **Ship-to list:** the header offers Thailand/Korea/Japan/China/USA, the checkout offers Thailand/Malaysia/Singapore/Indonesia/Brunei. Which countries does GloFe really deliver to? (Seeded: the checkout list.)
2. **Shipping fees:** none exist in the original. Should some countries have a fee? (All 0.00 until you tell me.)
3. **Product #4 wording** - confirm the one-word edit, or supply the description you want.
4. **Brand / estimated arrival** - do you want to provide values (e.g. "2-3 weeks after the deadline"), or leave them hidden?

## Code written but not yet wired to a route
`middleware/auth.js` (`requireAuth`, `requireAdmin`) is ready for the profile, cart and admin routes in later phases.
