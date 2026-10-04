CREATE DATABASE IF NOT EXISTS fleet_management;
USE fleet_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','viewer') NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  license_plate VARCHAR(30) UNIQUE NOT NULL,
  model VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100),
  year INT,
  capacity DECIMAL(10,2) DEFAULT 0,
  status ENUM('active','maintenance','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150),
  license_number VARCHAR(80) UNIQUE NOT NULL,
  license_expiry DATE,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  driver_id INT NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active','ended') DEFAULT 'active',
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

INSERT IGNORE INTO vehicles (license_plate,model,manufacturer,year,capacity,status)
VALUES
('TS09AB1234','Bolero','Mahindra',2023,7,'active'),
('TS10CD5678','Innova','Toyota',2022,7,'active'),
('TS11EF9012','Ace','Tata',2021,1.2,'maintenance');

INSERT IGNORE INTO drivers (name,phone,email,license_number,license_expiry,status)
VALUES
('Ravi Kumar','9876543210','ravi@example.com','DL-TS-10001','2028-05-20','active'),
('Suresh Reddy','9876501234','suresh@example.com','DL-TS-10002','2027-11-15','active'),
('Anil Kumar','9000011111','anil@example.com','DL-TS-10003','2026-12-31','active');