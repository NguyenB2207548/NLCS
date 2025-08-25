use car_db;

-- USERS
-- =====================
INSERT INTO Users (userID, name, email, password, phone, role) VALUES
(1, 'Nguyen Van A', 'a@example.com', '123456', '0901111222', 'customer'),
(2, 'Tran Thi B', 'b@example.com', '123456', '0903333444', 'customer'),
(3, 'Le Van C', 'c@example.com', '123456', '0905555666', 'owner'),
(4, 'Admin', 'admin@example.com', 'admin123', '0907777888', 'admin');

-- =====================
-- BRANDS
-- =====================
INSERT INTO Brands (brandID, brandName) VALUES
(1, 'Toyota'),
(2, 'Honda'),
(3, 'BMW');

-- =====================
-- CARS
-- =====================
INSERT INTO Cars (carID, userID, brandID, model, year, price_per_day, status) VALUES
(1, 3, 1, 'Vios', 2020, 500000, 'available'),
(2, 3, 2, 'Civic', 2021, 700000, 'available'),
(3, 3, 3, 'X5', 2022, 1500000, 'available');

-- =====================
-- CAR IMAGES
-- =====================
INSERT INTO car_images (imageID, carID, image_url) VALUES
(1, 1, 'vios.jpg'),
(2, 2, 'civic.jpg'),
(3, 3, 'bmw_x5.jpg');

-- =====================
-- CONTRACTS
-- =====================
INSERT INTO Contracts (contractID, userID, carID, rental_start_date, rental_end_date, total_price, status) VALUES
(1, 1, 1, '2025-08-01', '2025-08-05', 2000000, 'completed'),
(2, 2, 2, '2025-08-10', '2025-08-15', 3500000, 'active'),
(3, 1, 3, '2025-09-01', '2025-09-05', 7500000, 'pending');

-- =====================
-- PAYMENTS
-- =====================
INSERT INTO Payments (paymentID, contractID, amount, payment_date, status) VALUES
(1, 1, 2000000, '2025-08-05', 'paid'),
(2, 2, 3500000, '2025-08-10', 'unpaid');

-- =====================
-- NOTIFICATIONS
-- =====================
INSERT INTO Notifications (notificationID, userID, message, created_at) VALUES
(1, 1, 'Hợp đồng #1 đã hoàn thành', '2025-08-06 10:00:00'),
(2, 2, 'Hợp đồng #2 đang hoạt động', '2025-08-10 12:00:00'),
(3, 1, 'Hợp đồng #3 đang chờ duyệt', '2025-08-25 08:00:00');