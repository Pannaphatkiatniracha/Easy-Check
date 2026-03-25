-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 24, 2026 at 08:01 PM
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `employee_id` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `join_date` date NOT NULL,
  `gender` enum('Male','Female','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` enum('Budgeting & Planning Officer','Cybersecurity Specialist','Payroll Specialist','Content Marketing Executive','Customer Experience Analyst','Sales Coordinator','Key Account Manager','Content Creator','Motion Graphic Designer') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` enum('Finance','IT','Sales','Creative') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch` enum('Bangkok','Chiang Mai','Phuket','Chonburi','Khon Kaen') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `shift` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/img/default.jpg',
  `role` enum('user','approver','admin','superadmin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `password`, `full_name`, `email`, `phone`, `birth_date`, `join_date`, `gender`, `position`, `department`, `branch`, `shift`, `avatar`, `role`, `created_at`) VALUES
(1, '070504', '$2b$10$VhlxN2qsLkkhKJkg.1JfXeDnm9Xt9Kfx4O/udlfJyPPvCE/PYbEw6', 'kim minji', 'minjikim@gmail.com', '0812345678', '2004-05-07', '2026-03-22', 'Female', 'Customer Experience Analyst', 'IT', 'Bangkok', '9:00 AM to 6:00 PM.', 'https://i.pinimg.com/474x/cd/73/72/cd7372cfb5ec3048d07410415f4473cd.jpg', 'user', '2026-03-21 22:51:23'),
(2, '061004', '$2b$10$uS8YfncK9SByI9S.pYx5X.lzK.G7kGget9GStv8ZpM/6V.3yW1m3y', 'pham hanni', 'hannipham@gmail.com', '0891234567', '2004-10-06', '2026-03-22', 'Female', 'Sales Coordinator', 'Sales', 'Chiang Mai', '9:00 AM to 6:00 PM.', 'https://pbs.twimg.com/media/F6SFA6DW8AAAT-A.jpg', 'user', '2026-03-21 23:00:38'),
(3, '110405', '$2b$10$uS8YfncK9SByI9S.pYx5X.lzK.G7kGget9GStv8ZpM/6V.3yW1m3y', 'marsh danielle', 'daniellemarsh@gmail.com', '0829876543', '2015-04-11', '2026-03-22', 'Female', 'Content Creator', 'Creative', 'Phuket', '9:00 AM to 6:00 PM.', 'https://i.pinimg.com/736x/ba/af/a3/baafa30776cb39aa09afd0b31a415d10.jpg', 'user', '2026-03-21 23:04:36'),
(4, '150506', '$2b$10$uS8YfncK9SByI9S.pYx5X.lzK.G7kGget9GStv8ZpM/6V.3yW1m3y', 'kang haerin', 'haerinkang@gmail.com', '0855554321', '2006-05-15', '2026-03-22', 'Female', 'Budgeting & Planning Officer', 'Finance', 'Khon Kaen', '9:00 AM to 6:00 PM.', 'https://i.pinimg.com/736x/67/24/36/67243657617d4fef25b6aaed9bdd79a3.jpg', 'user', '2026-03-21 23:08:45'),
(5, '210408', '$2b$10$uS8YfncK9SByI9S.pYx5X.lzK.G7kGget9GStv8ZpM/6V.3yW1m3y', 'lee hyein', 'hyeinlee@gmail.com', '0877778888', '2008-04-21', '2026-03-22', 'Female', 'Motion Graphic Designer', 'Creative', 'Chonburi', '9:00 AM to 6:00 PM.', 'https://pbs.twimg.com/media/FaCyTw3WQAIhlrx.jpg', 'user', '2026-03-21 23:11:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
