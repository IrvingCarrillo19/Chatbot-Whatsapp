CREATE TABLE pizzas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  precio INT
);

CREATE TABLE bebidas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  precio INT
);

CREATE TABLE complementos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  precio INT
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(20),
  pizza VARCHAR(100),
  precio_pizza INT,
  bebida VARCHAR(100),
  precio_bebida INT,
  complemento VARCHAR(100),
  precio_complemento INT,
  total INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pizzas (nombre, precio) VALUES
('Pizza Pepperoni', 200),
('Pizza Hawaiana', 225),
('Pizza Bandidas', 250),
('Pizza Especial', 270),
('Pizza Gourmet', 299),
('Pizza Ranchera', 225);

INSERT INTO bebidas (nombre, precio) VALUES
('Coca-Cola', 35),
('Agua Mineral', 35),
('Jugo', 35);

INSERT INTO complementos (nombre, precio) VALUES
('Alitas BBQ', 50),
('Pan de ajo', 50),
('Ensalada cesar', 50);