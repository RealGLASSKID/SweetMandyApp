-- Sweet Mandy database schema (reference for Firebase Firestore / future SQL)
-- Collections map to tables below.

-- Business metadata (single document)
-- collection: business / doc: main
-- {
--   name: "Sweet Mandy",
--   fullName: "Sweet Mandy Bakery's",
--   ownerName: "",           -- fill later
--   address: "G794+4M7, Ijegun Last Bus Stop, Ijegun, Lagos",
--   phone: "0803 541 8887",
--   hours: "Open · Closes 9:30 pm",
--   deliveryZone: "Lagos Mainland only",
--   acceptingOrders: true
-- }

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  full_name     TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('customer', 'rider', 'admin')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  emoji         TEXT,
  sort_order    INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  price         INTEGER NOT NULL,          -- kobo/naira as integer
  category_id   TEXT REFERENCES categories(id),
  available     BOOLEAN DEFAULT TRUE,
  popular       BOOLEAN DEFAULT FALSE,
  rating        REAL DEFAULT 0,
  review_count  INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id                TEXT PRIMARY KEY,
  order_number      TEXT UNIQUE NOT NULL,
  user_id           TEXT REFERENCES users(id),
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  order_type        TEXT NOT NULL CHECK (order_type IN ('takeaway', 'delivery')),
  status            TEXT NOT NULL,
  subtotal          INTEGER NOT NULL,
  delivery_fee      INTEGER DEFAULT 0,     -- cash to rider
  total             INTEGER NOT NULL,      -- food total (Paystack for delivery)
  payment_method    TEXT CHECK (payment_method IN ('paystack', 'cash')),
  payment_state     TEXT,
  delivery_address  TEXT,
  delivery_area     TEXT,
  rider_id          TEXT REFERENCES users(id),
  special_notes     TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id              TEXT PRIMARY KEY,
  order_id        TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id      TEXT REFERENCES products(id),
  name            TEXT NOT NULL,
  image_url       TEXT,
  quantity        INT NOT NULL,
  unit_price      INTEGER NOT NULL,
  special_instructions TEXT
);

CREATE TABLE IF NOT EXISTS order_status_events (
  id          TEXT PRIMARY KEY,
  order_id    TEXT REFERENCES orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  label       TEXT NOT NULL,
  timestamp   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  type        TEXT CHECK (type IN ('order', 'promo', 'system')),
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_rider ON orders(rider_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
