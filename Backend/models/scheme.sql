create database car_db;
use car_db;

create table Users (
	userID int auto_increment,
    username varchar(100) not null unique,
    password varchar(100) not null,
    fullname varchar(100) not null,
    date_of_birth date,
    phone_number varchar(100) not null,
    primary key (userID)
);

create table Brands (
	brandID int auto_increment,
    brandname varchar(100) not null,
    country varchar(100),
    founded_year int,
    logo_URL varchar(255),
    primary key (brandID)
);

create table Cars (
	carID int auto_increment,
    carname varchar(100) not null,
    license_plate varchar(100) not null unique,
    year_manufacture int,
    seats int,
    fuel_type varchar(100),
    car_status ENUM('available', 'rented', 'maintenance') default 'available',
    pickup_location varchar(100),
	price_per_date double,
    userID int,
    brandID int,
    primary key (carID),
    foreign key (userID) references Users (userID),
    foreign key (brandID) references Brands (brandID)
);

create table Contracts (
	contractID int auto_increment,
    rental_start_date date not null,
    rental_end_date date not null,
    contract_status ENUM ('pending', 'active', 'completed', 'cancelled') default 'pending',
    total_price double,
	userID int not null,
    carID int not null,
    primary key (contractID),
    foreign key (userID) references Users(userID),
    foreign key (carID) references Cars(carID),
    constraint chk_dates check (rental_start_date < rental_end_date)
);

create table Payments (
	paymentID int auto_increment,
    payment_date date,
    payment_method varchar(100),
    total_price double,
    payment_status ENUM ('pending', 'completed', 'failed', 'refunded') default 'pending',
    contractID int not null,
    primary key (paymentID),
    foreign key (contractID) references Contracts (contractID)
);

create table Car_images (
	imgID int auto_increment,
    carID int,
    imgURL varchar(255),
    primary key (imgID),
    foreign key (carID) references Cars(carID) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

ALTER TABLE Users ADD COLUMN admin BOOLEAN DEFAULT FALSE;
alter table Cars add column img_URL varchar(255);


ALTER TABLE Payments
MODIFY COLUMN payment_date DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE Users ADD COLUMN is_active BOOLEAN DEFAULT true;

ALTER TABLE Contracts MODIFY carID INT NULL;

ALTER TABLE Contracts DROP FOREIGN KEY contracts_ibfk_2;

ALTER TABLE Contracts
ADD CONSTRAINT fk_car_contract
FOREIGN KEY (carID) REFERENCES Cars(carID)
ON DELETE SET NULL;

ALTER TABLE Contracts ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE Payments ADD COLUMN amount DECIMAL(10,2) NOT NULL AFTER total_price;

ALTER TABLE Payments
MODIFY COLUMN amount DOUBLE NOT NULL;

