CREATE IF NOT EXISTS DATABASE online_shop_db;

\c online_shop_db

CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL
);

ALTER TABLE category ADD CONSTRAINT category_self_join_fk 
FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE;

CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    count INTEGER NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    rating DECIMAL(2, 1) NULL,
    category_id INTEGER NOT NULL,

    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE customer(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(16) NOT NULL,
    phone_number VARCHAR(13) NOT NULL,
    address VARCHAR(255) NULL
);

CREATE TYPE order_status AS ENUM ('In process', 'Pending', 'Delivered', 'Partially paid', 'Paid', 'Closed');

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    number SERIAL CHECK (number >= 100),
    created_time DATE NOT NULL,
    order_status order_status DEFAULT 'Pending',
    customer_id INTEGER NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

CREATE TABLE payments(
    id SERIAL PRIMARY KEY,
    created_time DATE DEFAULT NOW()::DATE NOT NULL,
    customer_id INTEGER,
    total_price DECIMAL(10,2),
    contract_id INT,

    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (contract_id) REFERENCES contract(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE order_details(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,

    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

ALTER TABLE order_details DROP COLUMN total_price;

ALTER TABLE payments DROP COLUMN order_id;

ALTER TABLE payments ADD COLUMN total_price DECIMAL(10,2);

ALTER TABLE payments ADD COLUMN contract_id INT;

ALTER TABLE product ALTER category_id DROP NOT NULL

CREATE TYPE contract_status_enum AS ENUM ('active', 'done');

CREATE TABLE contract(
    id SERIAL PRIMARY KEY,
    customer_id INT,
    order_id INT,
    monthly_payment DECIMAL(10,2),
    contract_type_id INT,
    contract_status contract_status_enum DEFAULT 'active',
    starting_payment_percentage INT,
    total_payment DECIMAL(10,2),

    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (contract_type_id) REFERENCES contract_type(id) ON DELETE CASCADE ON UPDATE NO ACTION
)

CREATE TABLE contract_type(
    id SERIAL PRIMARY KEY,
    duration INT,
    percentage INT
)

ALTER TABLE orders ALTER COLUMN created_time TYPE TIMESTAMP;
ALTER TABLE orders ALTER COLUMN created_time SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE orders DROP CONSTRAINT orders_number_check;