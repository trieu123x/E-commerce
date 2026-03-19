-- psql -U postgres -d ecommerce_db -f schema.sql
-- =========================
-- DROP TABLE 
-- =========================
DROP TABLE IF EXISTS
  wishlists,
  reviews,
  shipments,
  payments,
  order_items,
  orders,
  cart_items,
  carts,
  product_images,
  products,
  categories,
  addresses,
  users,
  coupons,
  order_coupons,
  sales,
  product_sales
CASCADE;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ADDRESSES (1 user nhiều địa chỉ)
-- =========================
CREATE TABLE addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city VARCHAR(100),
  district VARCHAR(100),
  ward VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE
);

-- =========================
-- CATEGORIES (cha - con)
-- =========================
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL
);

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  stock INT DEFAULT 0 CHECK (stock >= 0),
  category_id BIGINT REFERENCES categories(id),
  seller_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PRODUCT IMAGES
-- =========================
CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT FALSE
);

-- =========================
-- CARTS (1 user = 1 cart)
-- =========================
CREATE TABLE carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- CART ITEMS
-- =========================
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT REFERENCES carts(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  quantity INT DEFAULT 1 CHECK (quantity > 0),
  UNIQUE(cart_id, product_id)
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  shipping_address TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price NUMERIC(12,2) NOT NULL
);

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  method VARCHAR(30),
  status VARCHAR(30),
  paid_at TIMESTAMP
);

-- =========================
-- SHIPMENTS
-- =========================
CREATE TABLE shipments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(100),
  tracking_code VARCHAR(100),
  status VARCHAR(30)
);

-- =========================
-- REVIEWS
-- =========================
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- =========================
-- WISHLISTS
-- =========================
CREATE TABLE wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- SALES

CREATE TABLE sales (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT_SALES

CREATE TABLE product_sales (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, sale_id)
);

-- COUPONS

CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_value NUMERIC(10,2) DEFAULT 0,
    max_discount NUMERIC(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDER_COUPONS

CREATE TABLE order_coupons (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    coupon_id BIGINT NOT NULL REFERENCES coupons(id),
    discount_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

