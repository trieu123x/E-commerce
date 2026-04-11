-- USERS
INSERT INTO users (email, password_hash, full_name)
VALUES ('test@gmail.com', '123456', 'Test User');

-- CATEGORIES
INSERT INTO categories (name)
VALUES ('Áo');

-- PRODUCTS
INSERT INTO products (name, price, stock, category_id)
VALUES ('Áo thun', 199000, 10, 1);

-- CHECK
SELECT * FROM users;
SELECT * FROM products;
SELECT schema_name 
FROM information_schema.schemata;
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name IN ('users', 'products');

SELECT current_schema();

ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'ACTIVE';

UPDATE users SET status = 'ACTIVE' WHERE status IS NULL;

ALTER TABLE products DROP COLUMN IF EXISTS seller_id;

ALTER TABLE products
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

UPDATE products SET status = 'ACTIVE' WHERE status IS NULL;

ALTER TABLE products
ADD COLUMN reserved_stock DECIMAL(12,2) NOT NULL DEFAULT 0;

UPDATE orders SET status = UPPER(status);

SELECT DISTINCT status FROM orders;

ALTER TABLE addresses
ADD COLUMN house_number VARCHAR(50);


