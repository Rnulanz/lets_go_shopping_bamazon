DROP DATABASE IF EXISTS letsGoShopping_db;

CREATE DATABASE  letsGoShopping_db;

USE letsGoShopping_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NULL,
    dept_name VARCHAR(50) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT(10) NULL,
    PRIMARY KEY(id)
);


INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Norton 360 Deluxe", "Softwar", 29.99, 50),
("Microsoft Office 365", "Software", 99.99, 75),
("Instant Pot Pressure Cooker", "Kitchen and Dining", 59.89, 25),
("The Mini Waffle Maker", "Kitchen and Dining", 16.98, 15),
("Houston Astros 2019 Topps Baseball Cards", "Sports Collectibles", 14.95, 100),
("Washington Capitals Stanlry Cup Crystal Puck", "Sports Collectibles", 49.99, 5),
("Mac Sports Collapsible Folding Wagon", "Lawn and Garden", 88.19, 32),
("Terro Ant Bait", "Lawn and Garden", 4.89, 115),
("Yeti Rambler 20oz", "Sports and Outdoors", 29.99, 53),
("Sabre Red Pepper Spray Keychain", "Sports and Outdoors", 9.99, 86);