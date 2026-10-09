'use strict';
/**
 * Server-side input validation (never trust the frontend). Pure functions, no dependencies.
 * Each parseX() returns the cleaned value or throws AppError.validation({field: message}).
 */
const AppError = require('./AppError');

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
// Letters/marks from any script (Thai, Korean, ...), spaces and  . ' ’ -  ; blocks <, >, digits, symbols.
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password12', 'password123', 'password1234', '1234567890',
  '12345678910', 'qwertyuiop', 'qwerty12345', 'iloveyou123', 'letmein1234', 'welcome1234',
  'admin12345', 'glofe12345', 'abc1234567', 'passw0rd123',
]);

const PASSWORD_MIN = 10;
const PASSWORD_MAX_BYTES = 72; // bcrypt silently ignores bytes beyond 72 - reject instead

function isPlainObject(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function str(v) { return typeof v === 'string' ? v : ''; }

function validateName(raw, errors, field = 'name') {
  const name = str(raw).normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!name) errors[field] = 'Please enter your name.';
  else if (name.length > 100) errors[field] = 'Name must be 100 characters or fewer.';
  else if (!NAME_RE.test(name)) errors[field] = 'Name may contain letters, spaces, apostrophes, hyphens and periods only.';
  return name;
}

function validateEmail(raw, errors, field = 'email') {
  const email = str(raw).trim().toLowerCase();
  if (!email) errors[field] = 'Please enter your email address.';
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors[field] = 'Please enter a valid email address.';
  return email;
}

/** Password policy: 10+ chars, <=72 bytes, at least one letter and one number, not a common password. */
function passwordProblem(password, email, minLength = PASSWORD_MIN) {
  if (typeof password !== 'string' || !password) return 'Please enter a password.';
  if ([...password].length < minLength) return `Password must be at least ${minLength} characters.`;
  if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) return 'Password is too long (maximum 72 bytes).';
  if (!/\p{L}/u.test(password) || !/\p{N}/u.test(password)) return 'Password must include at least one letter and one number.';
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return 'That password is too common. Please choose another.';
  if (email && password.toLowerCase() === email.toLowerCase()) return 'Password must not be the same as your email.';
  return null;
}

function parseRegister(body) {
  if (!isPlainObject(body)) throw AppError.badRequest('Request body must be a JSON object.');
  const errors = {};
  const name = validateName(body.name, errors);
  const email = validateEmail(body.email, errors);
  const password = typeof body.password === 'string' ? body.password : '';
  const problem = passwordProblem(password, email);
  if (problem) errors.password = problem;
  if (body.confirmPassword !== undefined && body.confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (Object.keys(errors).length) throw AppError.validation(errors);
  return { name, email, password };
}

function parseLogin(body) {
  if (!isPlainObject(body)) throw AppError.badRequest('Request body must be a JSON object.');
  const errors = {};
  const email = validateEmail(body.email, errors);
  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) errors.password = 'Please enter your password.';
  else if (Buffer.byteLength(password, 'utf8') > 1024) errors.password = 'Password is too long.';
  if (Object.keys(errors).length) throw AppError.validation(errors);
  return { email, password };
}

// ---- Product list query -------------------------------------------------------------
const SORTS = ['newest', 'price_asc', 'price_desc'];

function positiveInt(raw, field, errors, { min = 1, max = 1e9, fallback } = {}) {
  if (raw === undefined || raw === '') return fallback;
  if (typeof raw !== 'string' || !/^\d{1,9}$/.test(raw) || Number(raw) < min || Number(raw) > max) {
    errors[field] = `${field} must be a whole number between ${min} and ${max}.`;
    return fallback;
  }
  return Number(raw);
}

function parseProductQuery(query) {
  const errors = {};
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : '';
  const country = typeof query.country === 'string' ? query.country.trim().slice(0, 80) : '';
  const category = typeof query.category === 'string' ? query.category.trim().slice(0, 80) : '';

  let minPrice, maxPrice;
  for (const [key, setter] of [['minPrice', (v) => (minPrice = v)], ['maxPrice', (v) => (maxPrice = v)]]) {
    const raw = query[key];
    if (raw === undefined || raw === '') continue;
    if (typeof raw !== 'string' || !/^\d{1,8}(\.\d{1,2})?$/.test(raw)) errors[key] = `${key} must be a positive number.`;
    else setter(Number(raw));
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    errors.minPrice = 'minPrice cannot be greater than maxPrice.';
  }

  const sort = query.sort === undefined || query.sort === '' ? 'newest' : query.sort;
  if (!SORTS.includes(sort)) errors.sort = `sort must be one of: ${SORTS.join(', ')}.`;

  const page = positiveInt(query.page, 'page', errors, { max: 100000, fallback: 1 });
  const limit = positiveInt(query.limit, 'limit', errors, { max: 48, fallback: 12 });

  if (Object.keys(errors).length) throw AppError.validation(errors, 'Invalid query parameters.');
  return { q, country, category, minPrice, maxPrice, sort, page, limit };
}

function parseIdParam(raw, label = 'id') {
  if (typeof raw !== 'string' || !/^[1-9]\d{0,17}$/.test(raw)) throw AppError.notFound(`${label} not found.`);
  return raw;
}

module.exports = {
  EMAIL_RE, PASSWORD_MIN, SORTS,
  validateName, validateEmail, passwordProblem,
  parseRegister, parseLogin, parseProductQuery, parseIdParam,
};
