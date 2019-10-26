CREATE DATABASE bamazon

CREATE TABLE products (
    item_id INT AUTO_INCUREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR (45) NULL,
    price DECIMAL (10, 2),
    stock_quanity INT (10)
)
