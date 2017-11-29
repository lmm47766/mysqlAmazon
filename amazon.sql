DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50),
  department_name VARCHAR(50),
  price DECIMAL(10,2),
  stock_quantity INTEGER,
  product_sales DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name,price,stock_quantity) 
values ('iphone', 'Cell Phones', 99.99, 40),
('TV', 'Electronics', 1699.99, 25),
('Toaster', 'Electronics', 49.50, 74),
('Sofa', 'Living Room', 199.99, 10),
('The Avengers', 'Movies', 9.99, 50),
('Macbook Pro', 'Electronics', 999.99, 50),
('Dresser', 'Bedroom', 99.99, 100),
('LG Oven', 'Kitchen', 300, 30),
('Call of Duty: WWII', 'Video Games', 50, 100),
('Table', 'Living Room', 80, 40);


CREATE TABLE departments(
  department_id INTEGER AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(50),
  over_head_cost decimal(10,2),
  PRIMARY KEY (department_id)
);


INSERT INTO departments (department_name,over_head_cost) 
values ('Bedroom', 600),
('Cell Phones',999.99),
('Electronics', 30000),
('Kitchen', 700),
('Living Room', 1000),
('Movies',250),
('Video Games',300);

SELECT * from departments;

SELECT products.department_name, SUM(product_sales) AS product_sales, sum(departments.over_head_cost) AS over_head_cost, SUM(product_sales)-SUM(departments.over_head_cost) AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name

