use car_db;

INSERT INTO Users (username, password, fullname, date_of_birth, phone_number)
VALUES 
('john_doe', 'hashed_password_123', 'John Doe', '1990-05-20', '0912345678'),
('alice_nguyen', 'hashed_password_abc', 'Nguyen Thi Alice', '1995-09-15', '0987654321'),
('minhtran', 'hashed_pw_xyz', 'Tran Van Minh', '1988-12-01', '0909123456');

INSERT INTO Brands (brandname, country, founded_year, logo_URL)
VALUES 
('Toyota', 'Japan', 1937, 'https://example.com/logos/toyota.png'),
('Ford', 'USA', 1903, 'https://example.com/logos/ford.png'),
('BMW', 'Germany', 1916, 'https://example.com/logos/bmw.png');

INSERT INTO Cars (carname, license_plate, year_manufacture, seats, fuel_type, car_status, pickup_location, price_per_date, userID, brandID)
VALUES
('Toyota Vios', '51A-12345', 2020, 5, 'Petrol', 'available', 'Ho Chi Minh', 500000, 1, 1),
('Ford Ranger', '30F-67890', 2022, 5, 'Diesel', 'rented', 'Hanoi', 700000, 2, 2),
('BMW X5', '29C-45678', 2021, 7, 'Petrol', 'maintenance', 'Da Nang', 1200000, 3, 3);

INSERT INTO Contracts (rental_start_date, rental_end_date, contract_status, total_price, userID, carID)
VALUES
('2025-06-01', '2025-06-05', 'completed', 2000000, 1, 1),
('2025-06-10', '2025-06-12', 'active', 1400000, 2, 2),
('2025-07-01', '2025-07-03', 'pending', 2400000, 3, 3);

INSERT INTO Payments (payment_date, payment_method, total_price, payment_status, contractID)
VALUES
('2025-06-01', 'card', 2000000, 'completed', 1),
('2025-06-10', 'bank_transfer', 1400000, 'completed', 2),
('2025-07-01', 'cash', 2400000, 'pending', 3);

