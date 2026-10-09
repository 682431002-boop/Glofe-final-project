-- ============================================================================
-- GloFe database schema  (target: MySQL 8.0.16+ / 8.4 LTS, InnoDB, utf8mb4)
--   * CHECK constraints need MySQL >= 8.0.16 (older versions parse but ignore them).
--   * Money columns are DECIMAL. Passwords are stored only as bcrypt hashes.
--   * Historical records (orders, order_items, payments) are protected with
--     ON DELETE RESTRICT: users/products with orders cannot be hard-deleted.
--     Products are deactivated (is_active = 0) instead of deleted.
-- Import (database must already exist and be selected):
--   mysql --default-character-set=utf8mb4 -u root glofe < database/schema.sql
-- ============================================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- Users & addresses
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(100)    NOT NULL,
  email          VARCHAR(254)    NOT NULL,
  password_hash  VARCHAR(255)    NOT NULL,                 -- bcrypt hash only
  role           ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  is_active      TINYINT(1)      NOT NULL DEFAULT 1,
  last_login_at  DATETIME        NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Countries serve two purposes: where products come from (is_origin) and where
-- GloFe ships to (is_shipping_destination). shipping_fee is 0.00 until configured.
CREATE TABLE countries (
  id                       SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code                     CHAR(2)       NOT NULL,           -- ISO 3166-1 alpha-2
  name                     VARCHAR(80)   NOT NULL,
  flag_emoji               VARCHAR(16)   NULL,
  is_origin                TINYINT(1)    NOT NULL DEFAULT 0,
  is_shipping_destination  TINYINT(1)    NOT NULL DEFAULT 0,
  shipping_fee             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active                TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_countries_code (code),
  UNIQUE KEY uq_countries_name (name),
  CONSTRAINT chk_countries_fee CHECK (shipping_fee >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE addresses (
  id              BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED   NOT NULL,
  label           VARCHAR(50)       NULL,
  recipient_name  VARCHAR(100)      NOT NULL,
  phone           VARCHAR(30)       NOT NULL,
  line1           VARCHAR(200)      NOT NULL,
  line2           VARCHAR(200)      NULL,
  city            VARCHAR(100)      NOT NULL,
  state_province  VARCHAR(100)      NULL,
  postal_code     VARCHAR(20)       NOT NULL,
  country_id      SMALLINT UNSIGNED NOT NULL,
  is_default      TINYINT(1)        NOT NULL DEFAULT 0,
  created_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_addresses_user (user_id),
  CONSTRAINT fk_addresses_user    FOREIGN KEY (user_id)    REFERENCES users (id)     ON DELETE CASCADE,
  CONSTRAINT fk_addresses_country FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
CREATE TABLE categories (
  id    SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(60)       NOT NULL,
  slug  VARCHAR(80)       NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- category_id = primary category (first tag in the original data).
-- tags keeps the complete original tag list so no existing information is lost.
-- stock_quantity NULL = pre-order slots are not limited (no real-time stock is claimed).
CREATE TABLE products (
  id                 BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  name               VARCHAR(255)      NOT NULL,
  description        TEXT              NULL,
  price              DECIMAL(10,2)     NOT NULL,
  currency           CHAR(3)           NOT NULL DEFAULT 'THB',
  country_id         SMALLINT UNSIGNED NOT NULL,              -- country of origin
  category_id        SMALLINT UNSIGNED NOT NULL,
  brand              VARCHAR(100)      NULL,
  tags               JSON              NOT NULL,
  stock_quantity     INT UNSIGNED      NULL,
  is_preorder        TINYINT(1)        NOT NULL DEFAULT 1,
  preorder_deadline  DATE              NULL,                  -- last day an order is accepted
  estimated_arrival  VARCHAR(100)      NULL,
  is_active          TINYINT(1)        NOT NULL DEFAULT 1,
  created_at         DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_active_country  (is_active, country_id),
  KEY idx_products_category        (category_id),
  KEY idx_products_price           (price),
  KEY idx_products_created         (created_at),
  CONSTRAINT fk_products_country  FOREIGN KEY (country_id)  REFERENCES countries (id)  ON DELETE RESTRICT,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT,
  CONSTRAINT chk_products_price   CHECK (price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_images (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id  BIGINT UNSIGNED NOT NULL,
  image_path  VARCHAR(255)    NOT NULL,       -- e.g. assets/images/carlyn2.jpg (unchanged original paths)
  alt_text    VARCHAR(255)    NULL,
  sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_primary  TINYINT(1)      NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_images_product (product_id, sort_order),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_variants (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id      BIGINT UNSIGNED NOT NULL,
  option_name     VARCHAR(30)     NOT NULL DEFAULT 'Size',
  option_value    VARCHAR(30)     NOT NULL,
  stock_quantity  INT UNSIGNED    NULL,                       -- NULL = not limited
  sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active       TINYINT(1)      NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_variant (product_id, option_name, option_value),
  CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Cart & wishlist (persistent, for logged-in users)
-- ---------------------------------------------------------------------------
CREATE TABLE carts (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_carts_user (user_id),
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- variant_id may be NULL (products without sizes). MySQL treats NULLs as distinct in
-- UNIQUE indexes, so variant_key (NULL -> 0) is used to prevent duplicate cart lines.
CREATE TABLE cart_items (
  id          BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  cart_id     BIGINT UNSIGNED   NOT NULL,
  product_id  BIGINT UNSIGNED   NOT NULL,
  variant_id  BIGINT UNSIGNED   NULL,
  variant_key BIGINT UNSIGNED   GENERATED ALWAYS AS (IFNULL(variant_id, 0)) VIRTUAL,
  quantity    SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  created_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_line (cart_id, product_id, variant_key),
  KEY idx_cart_items_product (product_id),
  CONSTRAINT fk_cart_items_cart    FOREIGN KEY (cart_id)    REFERENCES carts (id)            ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products (id)         ON DELETE RESTRICT,
  CONSTRAINT fk_cart_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE RESTRICT,
  CONSTRAINT chk_cart_items_qty    CHECK (quantity BETWEEN 1 AND 99)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wishlists (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlists_user (user_id),
  CONSTRAINT fk_wishlists_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wishlist_items (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  wishlist_id  BIGINT UNSIGNED NOT NULL,
  product_id   BIGINT UNSIGNED NOT NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist_product (wishlist_id, product_id),
  CONSTRAINT fk_wishlist_items_wishlist FOREIGN KEY (wishlist_id) REFERENCES wishlists (id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_items_product  FOREIGN KEY (product_id)  REFERENCES products (id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Orders (historical records: never cascade-deleted)
-- ---------------------------------------------------------------------------
CREATE TABLE orders (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number     VARCHAR(24)     NOT NULL,                  -- unique, generated server-side
  user_id          BIGINT UNSIGNED NOT NULL,
  status           ENUM('pending','confirmed','ordered_from_supplier','in_transit',
                        'ready_for_delivery','completed','cancelled') NOT NULL DEFAULT 'pending',
  subtotal         DECIMAL(12,2)   NOT NULL,
  shipping_fee     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  total            DECIMAL(12,2)   NOT NULL,
  currency         CHAR(3)         NOT NULL DEFAULT 'THB',
  -- Shipping address SNAPSHOT (copied at checkout so later profile edits don't rewrite history)
  ship_recipient   VARCHAR(100)    NOT NULL,
  ship_phone       VARCHAR(30)     NOT NULL,
  ship_line1       VARCHAR(200)    NOT NULL,
  ship_line2       VARCHAR(200)    NULL,
  ship_city        VARCHAR(100)    NOT NULL,
  ship_state       VARCHAR(100)    NULL,
  ship_postal_code VARCHAR(20)     NOT NULL,
  ship_country_id  SMALLINT UNSIGNED NOT NULL,
  customer_note    VARCHAR(500)    NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_number (order_number),
  KEY idx_orders_user_created (user_id, created_at),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_user    FOREIGN KEY (user_id)         REFERENCES users (id)     ON DELETE RESTRICT,
  CONSTRAINT fk_orders_country FOREIGN KEY (ship_country_id) REFERENCES countries (id) ON DELETE RESTRICT,
  CONSTRAINT chk_orders_amounts CHECK (subtotal >= 0 AND shipping_fee >= 0 AND total = subtotal + shipping_fee)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Snapshot of what was bought, so history stays accurate when products change.
CREATE TABLE order_items (
  id             BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_id       BIGINT UNSIGNED   NOT NULL,
  product_id     BIGINT UNSIGNED   NOT NULL,
  variant_id     BIGINT UNSIGNED   NULL,
  product_name   VARCHAR(255)      NOT NULL,
  variant_label  VARCHAR(80)       NULL,                      -- e.g. "Size M"
  image_path     VARCHAR(255)      NULL,
  unit_price     DECIMAL(10,2)     NOT NULL,
  quantity       SMALLINT UNSIGNED NOT NULL,
  line_total     DECIMAL(12,2)     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order   FOREIGN KEY (order_id)   REFERENCES orders (id)           ON DELETE RESTRICT,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)         ON DELETE RESTRICT,
  CONSTRAINT fk_order_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants (id) ON DELETE SET NULL,
  CONSTRAINT chk_order_items_qty    CHECK (quantity >= 1),
  CONSTRAINT chk_order_items_total  CHECK (line_total = unit_price * quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_status_history (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id            BIGINT UNSIGNED NOT NULL,
  from_status         VARCHAR(30)     NULL,
  to_status           VARCHAR(30)     NOT NULL,
  changed_by_user_id  BIGINT UNSIGNED NULL,
  note                VARCHAR(255)    NULL,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_status_history_order (order_id, created_at),
  CONSTRAINT fk_status_history_order FOREIGN KEY (order_id)           REFERENCES orders (id) ON DELETE RESTRICT,
  CONSTRAINT fk_status_history_user  FOREIGN KEY (changed_by_user_id) REFERENCES users (id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- is_simulated = 1 means NO real money moved (school demonstration / cash on delivery).
CREATE TABLE payments (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED NOT NULL,
  provider      VARCHAR(30)     NOT NULL,                     -- 'simulated', 'cod', later a real gateway
  method        VARCHAR(30)     NOT NULL,
  status        ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  amount        DECIMAL(12,2)   NOT NULL,
  currency      CHAR(3)         NOT NULL DEFAULT 'THB',
  is_simulated  TINYINT(1)      NOT NULL DEFAULT 1,
  reference     VARCHAR(64)     NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_payments_order (order_id),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
  CONSTRAINT chk_payments_amount CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Contact messages & sessions
-- ---------------------------------------------------------------------------
CREATE TABLE contact_messages (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NULL,
  name        VARCHAR(100)    NOT NULL,
  email       VARCHAR(254)    NOT NULL,
  subject     VARCHAR(200)    NOT NULL,
  message     TEXT            NOT NULL,
  status      ENUM('new','read','resolved') NOT NULL DEFAULT 'new',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_status_created (status, created_at),
  CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Server-side session storage (the browser only holds an opaque, HTTP-only session ID cookie).
CREATE TABLE sessions (
  sid         VARCHAR(128) NOT NULL,
  data        MEDIUMTEXT   NOT NULL,
  expires_at  DATETIME     NOT NULL,                          -- stored in UTC
  PRIMARY KEY (sid),
  KEY idx_sessions_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
