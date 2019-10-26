CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR (45) NULL,
    price DECIMAL (10, 2),
    stock_quanity INT NULL,
    PRIMARY KEY(item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Sony DSCW8000", "Electronics", 98.00, 150);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Xbox One S 1TB Console", "Electronics", 249.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Cravings", "Books: Hardcover", 16.58, 40);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Pioneer XDJ-RX2", "Electronics", 1698.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Ibanez 6 Srting Classical", "Musical Instruments", 119.99, 48);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Samsung Chromebook 3", "Computers", 139.99, 65);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Apple iPAd Air", "Tablets", 459.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Samung Galaxy Tab S6", "Tablets", 729.99, 32);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("PS4 Wired Controller", "Electronic: Controllers", 17.50, 56);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES("Diesel Mr.Daddy 2.0", "Watches", 139.95, 70);
