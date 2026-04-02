-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql

-- Generation Time: Apr 01, 2026 at 03:36 PM

-- Generation Time: Apr 01, 2026 at 09:59 AM

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
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int NOT NULL,
  `user_idemployee` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` varchar(20) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `photo` longblob,
  `approval_status` varchar(20) DEFAULT 'pending',
  `reject_reason` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` int NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `leave_start` date NOT NULL,
  `leave_end` date NOT NULL,
  `leave_reasons` text,
  `other_reason` text,
  `evidence_file` longblob,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reject_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `role_id` int NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`role_id`, `role`) VALUES
(1, 'user'),
(2, 'approver'),
(3, 'admin'),
(4, 'super admin');

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
(1, '101010', 1, 'Taro', 'Yu', 'female', '2005-02-14', '2026-03-31', 'Cybersecurity Specialist', 'IT', 'Bangkok', 'pataraporn142548@gmail.com', '$2b$10$kCnA9ItsPUbqvDnaAfQ2vez8wBLlyhXb9DFpeC7wj92Vwx8.X/UP.', '0652939090', 'https://i.pinimg.com/736x/67/de/76/67de7632379015a3dc7e080148bd5d8f.jpg'),
(2, '202020', 1, 'Bambi', 'Kang', 'female', '2006-06-11', '2026-03-31', 'Sales Coordinator', 'Sales', 'Chiang Mai', 'thitichatphoto@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0811235678', 'https://i.pinimg.com/736x/f5/f9/fb/f5f9fbdb8a74165249beda8b3de127c1.jpg'),
(3, '303030', 2, 'Maemom', 'Young', 'female', '2006-02-08', '2026-03-31', 'Approver', 'Finance', 'Phuket', 'compannaphat@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0876564732', 'https://i.pinimg.com/736x/fa/cd/a2/facda288a9633aade66c84642a8fcb6a.jpg'),
(4, '404040', 3, 'Boobi', 'Bubu', 'male', '2005-02-13', '2026-03-31', 'Admin', 'Sales', 'Chonburi', 'thanik1265@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0976453421', 'https://i.pinimg.com/1200x/45/bf/0b/45bf0b9e7f509e025d61091f677189f3.jpg'),
(5, '505050', 4, 'Meow', 'Whatislove', 'female', '2006-04-01', '2026-04-01', 'Super Admin', 'Creative', 'Khon Kaen', 'mo.sarasinee@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0894726153', 'https://i.pinimg.com/736x/8f/0d/1d/8f0d1ded2a11628c68891d1f268b5650.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `User_shifts`
--

CREATE TABLE `User_shifts` (
  `role_id` int NOT NULL,
  `shift_id` int NOT NULL,
  `user_id` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`);

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
  ADD UNIQUE KEY `id_employee` (`id_employee`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `id_employee_2` (`id_employee`);

--
-- Indexes for table `User_shifts`
--
ALTER TABLE `User_shifts`
  ADD KEY `role_id` (`role_id`,`shift_id`),
  ADD KEY `id` (`user_id`),
  ADD KEY `shift_id` (`shift_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `user_shifts_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `user_shifts_ibfk_3` FOREIGN KEY (`shift_id`) REFERENCES `Shifts` (`shift_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_shifts_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id_employee`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
