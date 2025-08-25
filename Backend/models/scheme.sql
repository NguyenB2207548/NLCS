-- Tạo database
CREATE DATABASE car_db;
USE car_db;

-- Bảng Users
CREATE TABLE Users (
    userID INT AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (userID)
);

-- Bảng Brands
CREATE TABLE Brands (
    brandID INT AUTO_INCREMENT,
    brandname VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    founded_year INT,
    logo_URL VARCHAR(255),
    PRIMARY KEY (brandID)
);

-- Bảng Cars
CREATE TABLE Cars (
    carID INT AUTO_INCREMENT,
    carname VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL UNIQUE,
    year_manufacture INT,
    seats INT,
    fuel_type VARCHAR(50),
    car_status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
    pickup_location VARCHAR(255),
    price_per_date DOUBLE NOT NULL,
    userID INT NOT NULL, -- chủ xe
    brandID INT,
    img_URL VARCHAR(255),
    PRIMARY KEY (carID),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (brandID) REFERENCES Brands(brandID) ON DELETE SET NULL
);

-- Bảng car_images (ảnh phụ)
CREATE TABLE car_images (
    img_ID INT AUTO_INCREMENT,
    carID INT NOT NULL,
    imgURL VARCHAR(255) NOT NULL,
    PRIMARY KEY (img_ID),
    FOREIGN KEY (carID) REFERENCES Cars(carID) ON DELETE CASCADE
);

-- Bảng Contracts
CREATE TABLE Contracts (
    contractID INT AUTO_INCREMENT,
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    contract_status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    total_price DOUBLE,
    userID INT NOT NULL,  -- người thuê
    carID INT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (contractID),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (carID) REFERENCES Cars(carID) ON DELETE CASCADE,
    CONSTRAINT chk_dates CHECK (rental_start_date < rental_end_date)
);

-- Bảng Payments
CREATE TABLE Payments (
    paymentID INT AUTO_INCREMENT,
    payment_date DATE,
    payment_method VARCHAR(100),
    total_price DOUBLE,
    amount DOUBLE,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    contractID INT NOT NULL,
    PRIMARY KEY (paymentID),
    FOREIGN KEY (contractID) REFERENCES Contracts(contractID) ON DELETE CASCADE
);

-- Bảng Notifications
CREATE TABLE Notifications (
    id INT AUTO_INCREMENT,
    userID INT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);
