-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 31, 2026 at 02:50 PM
-- Server version: 9.6.0
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `easycheck`
--

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `role_id` int NOT NULL,
  `level` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`role_id`, `level`) VALUES
(1, 'Admin'),
(2, 'Executive Level'),
(3, 'Management Level'),
(4, 'Staff Level');

-- --------------------------------------------------------

--
-- Table structure for table `Shifts`
--

CREATE TABLE `Shifts` (
  `shift_id` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Shifts`
--

INSERT INTO `Shifts` (`shift_id`, `start_time`, `end_time`) VALUES
(1, '08:00:00', '17:00:00'),
(2, '09:00:00', '18:00:00'),
(3, '10:00:00', '19:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `id_employee` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int NOT NULL,
  `firstname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `birthdate` date DEFAULT NULL,
  `joindate` date DEFAULT NULL,
  `position` enum('Budgeting & Planning Officer','Cybersecurity Specialist','Payroll Specialist','Content Marketing Executive','Customer Experience Analyst','Sales Coordinator','Key Account Manager','Content Creator','Motion Graphic Designer','Approver','Admin','Super Admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` enum('Finance','IT','Sales','Creative') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch` enum('Bangkok','Chiang Mai','Phuket','Chonburi','Khon Kaen') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/img/default.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `id_employee`, `role_id`, `firstname`, `lastname`, `gender`, `birthdate`, `joindate`, `position`, `department`, `branch`, `email`, `password`, `phone`, `avatar`) VALUES
(1, '101010', 1, 'Karina', 'Yuu', 'female', '1995-08-17', '2026-03-31', 'Approver', 'IT', 'Bangkok', 'pataraporn142548@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0652939090', 'https://f.ptcdn.info/205/085/000/m00b4dv5izYk0x2jQ0D-o.jpg'),
(2, '101011', 2, 'Winter', 'Kim', 'female', '2001-01-01', '2026-03-31', 'Sales Coordinator', 'Sales', 'Chiang Mai', 'Thitichatphoto@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0811235678', 'https://i.redd.it/4deveood0zwb1.jpg'),
(3, '101012', 3, 'Bambi', 'Cute', 'other', '1996-03-25', '2026-03-31', 'Admin', 'IT', 'Phuket', 'mo.sarasinee@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0876564732', 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ningning_Love_Your_W_2025_2.jpg'),
(4, '101013', 4, 'Boobi', 'Cute', 'other', '1999-03-16', '2026-03-31', 'Motion Graphic Designer', 'Creative', 'Chonburi', 'compannaphat@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0976453421', 'https://image.starnewskorea.com/21/2026/03/2026030511341757500_1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `User_shifts`
--

CREATE TABLE `User_shifts` (
  `role_id` int NOT NULL,
  `shift_id` int NOT NULL,
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`role_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `role_id_2` (`role_id`);

--
-- Indexes for table `Shifts`
--
ALTER TABLE `Shifts`
  ADD PRIMARY KEY (`shift_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `User_shifts`
--
ALTER TABLE `User_shifts`
  ADD KEY `role_id` (`role_id`,`shift_id`),
  ADD KEY `id` (`id`),
  ADD KEY `shift_id` (`shift_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `User_shifts`
--
ALTER TABLE `User_shifts`
  ADD CONSTRAINT `user_shifts_ibfk_1` FOREIGN KEY (`id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_shifts_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `user_shifts_ibfk_3` FOREIGN KEY (`shift_id`) REFERENCES `Shifts` (`shift_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
