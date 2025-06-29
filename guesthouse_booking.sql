-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2025 at 03:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `guesthouse_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `is_member` tinyint(1) DEFAULT 0,
  `membership_number` varchar(50) DEFAULT NULL,
  `id_proof_url` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','paid','cancelled','refunded') DEFAULT 'pending',
  `payment_mode` enum('cash','card','online','upi') DEFAULT 'online',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `mode` enum('cash','card','online','upi') NOT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports_cache`
--

CREATE TABLE `reports_cache` (
  `id` int(11) NOT NULL,
  `report_type` varchar(50) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT (current_timestamp() + interval 1 hour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `room_type` enum('Deluxe','Suite') NOT NULL,
  `room_number` varchar(10) NOT NULL,
  `status` enum('available','booked','maintenance') DEFAULT 'available',
  `facilities` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `room_type`, `room_number`, `status`, `facilities`, `created_at`) VALUES
(1, 'Deluxe', 'D101', 'available', 'AC, TV, WiFi, Mini Bar', '2025-06-27 18:51:31'),
(2, 'Deluxe', 'D102', 'available', 'AC, TV, WiFi, Mini Bar', '2025-06-27 18:51:31'),
(3, 'Deluxe', 'D103', 'booked', 'AC, TV, WiFi, Mini Bar', '2025-06-27 18:51:31'),
(4, 'Suite', 'S201', 'available', 'AC, TV, WiFi, Mini Bar, Jacuzzi, Balcony', '2025-06-27 18:51:31'),
(5, 'Suite', 'S202', 'available', 'AC, TV, WiFi, Mini Bar, Jacuzzi, Balcony', '2025-06-27 18:51:31'),
(6, 'Deluxe', '101', 'available', 'WiFi, TV, AC', '2025-06-28 15:37:16'),
(7, 'Deluxe', '102', 'booked', 'WiFi, AC', '2025-06-28 15:37:16'),
(8, 'Suite', '201', 'available', 'WiFi, TV, AC, Mini Fridge', '2025-06-28 15:37:16'),
(9, 'Suite', '202', 'booked', 'WiFi, TV, Bathtub, Balcony', '2025-06-28 15:37:16'),
(10, 'Deluxe', '103', 'available', 'WiFi, TV, AC', '2025-06-28 15:37:16'),
(11, 'Suite', '203', 'available', 'WiFi, TV, Bathtub', '2025-06-28 15:37:16'),
(12, 'Deluxe', '104', 'available', 'WiFi, AC', '2025-06-28 15:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `room_photos`
--

CREATE TABLE `room_photos` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_photos`
--

INSERT INTO `room_photos` (`id`, `room_id`, `image_url`, `is_primary`) VALUES
(1, 1, '/images/room101_1.jpg', 0),
(2, 1, '/images/room101_2.jpg', 0),
(3, 2, '/images/room201_1.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `room_prices`
--

CREATE TABLE `room_prices` (
  `id` int(11) NOT NULL,
  `room_type` enum('Deluxe','Suite') NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `price_member` decimal(10,2) NOT NULL,
  `price_non_member` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_prices`
--

INSERT INTO `room_prices` (`id`, `room_type`, `date_from`, `date_to`, `price_member`, `price_non_member`) VALUES
(1, 'Deluxe', '2025-01-01', '2025-12-31', 2500.00, 3000.00),
(2, 'Suite', '2025-01-01', '2025-12-31', 4500.00, 5500.00),
(3, 'Deluxe', '2025-07-01', '2025-07-15', 1800.00, 2200.00),
(4, 'Suite', '2025-07-01', '2025-07-15', 2500.00, 3000.00);

-- --------------------------------------------------------

--
-- Table structure for table `staff_users`
--

CREATE TABLE `staff_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('manager','receptionist','housekeeping','maintenance') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_users`
--

INSERT INTO `staff_users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Dhruv Bhatiya', 'dhruv@guesthouse.com', 'hashed_pw_staff1', 'manager', '2025-06-29 11:06:29'),
(2, 'Yana Patel', 'yana@guesthouse.com', 'hashed_pw_staff2', 'receptionist', '2025-06-29 11:06:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('admin','staff','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password_hash`, `user_type`, `created_at`) VALUES
(1, 'Admin', '6351779668', 'admin@hotel.com', '$2b$10$8TSz8ywWAHQ.RKTX8xmNl.9neipiProhyMEGDeizYSpK8DLXeCQ1i', 'admin', '2025-06-27 18:55:16'),
(2, 'Dhara', '9876543210', 'dhara@example.com', '', 'customer', '2025-06-28 11:37:20'),
(4, 'John', '1234567891', 'john@example.com', '$2b$10$hWKj7EOWyHgGcfTlVZpMuebhwD8FXcZaecfpl1krDuG8HgfsB4WGS', 'staff', '2025-06-28 12:42:40'),
(8, 'Dhara', '9876543210', 'dhara_new@example.com', 'hashed_pw_1', 'admin', '2025-06-29 10:55:46'),
(9, 'Aditya', '9876543211', 'aditya@example.com', 'hashed_pw_2', 'staff', '2025-06-29 10:55:46'),
(10, 'Jiya', '9876543212', 'jiya@example.com', 'hashed_pw_3', 'customer', '2025-06-29 10:55:46'),
(12, 'Jiya', '9876543212', 'jiya2@example.com', 'hashed_pw_3', 'customer', '2025-06-29 10:59:54'),
(13, 'Jiya', '9876543219', 'jiya_new@example.com', 'hashed_pw_jiya', 'customer', '2025-06-29 11:01:42'),
(14, 'Jiya', '9876543219', 'jiya_auto@example.com', 'hashed_pw_jiya', 'customer', '2025-06-29 11:04:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `idx_booking_dates` (`from_date`,`to_date`),
  ADD KEY `idx_user_bookings` (`user_id`),
  ADD KEY `idx_bookings_status` (`payment_status`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `idx_payment_status` (`status`),
  ADD KEY `idx_transaction_id` (`transaction_id`);

--
-- Indexes for table `reports_cache`
--
ALTER TABLE `reports_cache`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_report_type` (`report_type`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_number` (`room_number`),
  ADD KEY `idx_rooms_status` (`status`),
  ADD KEY `idx_rooms_type` (`room_type`);

--
-- Indexes for table `room_photos`
--
ALTER TABLE `room_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_room_photos` (`room_id`);

--
-- Indexes for table `room_prices`
--
ALTER TABLE `room_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_room_type_date` (`room_type`,`date_from`,`date_to`);

--
-- Indexes for table `staff_users`
--
ALTER TABLE `staff_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_type` (`user_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reports_cache`
--
ALTER TABLE `reports_cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `room_photos`
--
ALTER TABLE `room_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `room_prices`
--
ALTER TABLE `room_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staff_users`
--
ALTER TABLE `staff_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `room_photos`
--
ALTER TABLE `room_photos`
  ADD CONSTRAINT `room_photos_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
