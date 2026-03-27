-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 26, 2026 at 01:09 AM
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
  `position` enum('Budgeting & Planning Officer','Cybersecurity Specialist','Payroll Specialist','Content Marketing Executive','Customer Experience Analyst','Sales Coordinator','Key Account Manager','Content Creator','Motion Graphic Designer','Approver','Admin','Super Admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
(1, '070504', '$2b$10$VhlxN2qsLkkhKJkg.1JfXeDnm9Xt9Kfx4O/udlfJyPPvCE/PYbEw6', 'kim minji', 'minjikim@gmail.com', '081-234-5678', '2004-05-07', '2026-03-22', 'Female', 'Customer Experience Analyst', 'IT', 'Bangkok', '9:00 AM to 6:00 PM.', 'https://i.pinimg.com/736x/d7/59/90/d759906217839945d7aaf777639168ea.jpg', 'user', '2026-03-21 22:51:23'),
(2, '061004', '$2b$10$T2SPr2oR.tZtWdddtOIJJeSqcRLv0pPICVgOqHglwvdb6PP87rqXW', 'pham hanni', 'hannipham@gmail.com', '089-123-4567', '2004-10-06', '2026-03-22', 'Female', 'Sales Coordinator', 'Sales', 'Chiang Mai', '9:00 AM to 6:00 PM.', 'https://pbs.twimg.com/media/F6SFA6DW8AAAT-A.jpg', 'user', '2026-03-21 23:00:38'),
(3, '110405', '$2b$10$T2SPr2oR.tZtWdddtOIJJeSqcRLv0pPICVgOqHglwvdb6PP87rqXW', 'marsh danielle', 'daniellemarsh@gmail.com', '082-987-6543', '2015-04-11', '2026-03-22', 'Female', 'Content Creator', 'Creative', 'Phuket', '9:00 AM to 6:00 PM.', 'https://i.pinimg.com/1200x/99/cd/59/99cd5915a24bd4c388f190f3d5c9275d.jpg', 'user', '2026-03-21 23:04:36'),
(4, '150506', '$2b$10$T2SPr2oR.tZtWdddtOIJJeSqcRLv0pPICVgOqHglwvdb6PP87rqXW', 'kang haerin', 'haerinkang@gmail.com', '085-555-4321', '2006-05-15', '2026-03-22', 'Female', 'Budgeting & Planning Officer', 'Finance', 'Khon Kaen', '9:00 AM to 6:00 PM.', 'https://i.pinimg.com/736x/2b/53/46/2b53469041cf77ee2a9cba67449b0685.jpg', 'user', '2026-03-21 23:08:45'),
(5, '210408', '$2b$10$T2SPr2oR.tZtWdddtOIJJeSqcRLv0pPICVgOqHglwvdb6PP87rqXW', 'lee hyein', 'hyeinlee@gmail.com', '087-777-8888', '2008-04-21', '2026-03-22', 'Female', 'Motion Graphic Designer', 'Creative', 'Chonburi', '9:00 AM to 6:00 PM.', 'https://i.pinimg.com/736x/f3/f4/2b/f3f42bd504d475aad89d9e066033e6db.jpg', 'user', '2026-03-21 23:11:06'),
(6, '180607', '$2b$10$VhlxN2qsLkkhKJkg.1JfXeDnm9Xt9Kfx4O/udlfJyPPvCE/PYbEw6', 'kim stella', 'stellakim@gmail.com', '092-345-6789', '2007-06-17', '2026-03-25', 'Female', 'Motion Graphic Designer', 'Creative', 'Bangkok', '9:00 AM to 6:00 PM.', 'https://pbs.twimg.com/media/HDxFs0CXoAASWxU?format=jpg&name=large', 'approver', '2026-03-25 14:27:25'),
(7, '131105', '$2b$10$sEPBZ629ZValv018WNIJZOzohy4Ya68dUXZnWML9XeuUUfHaArwjW', 'lee youngseo', 'youngseolee@gmail.com', '081-234-5678', '2005-11-13', '2026-03-25', 'Female', 'Admin', 'IT', 'Chiang Mai', '9:00 AM to 6:00 PM.', 'https://preview.redd.it/lee-youngseo-r-u-next-contestant-former-pre-debut-illit-v0-h1uoav2u235f1.jpg?width=1080&crop=smart&auto=webp&s=f6ad2a949459db736a02b8bbfc735b571ca9c2a0', 'admin', '2026-03-25 15:03:43'),
(8, '230102', '$2b$10$VhlxN2qsLkkhKJkg.1JfXeDnm9Xt9Kfx4O/udlfJyPPvCE/PYbEw6', 'moon annie', 'anniemoon@gmail.com', '089-765-4321', '2002-01-23', '2026-03-25', 'Female', 'Super Admin', 'Finance', 'Phuket', '9:00 AM to 6:00 PM.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSobCOrikOQSyGP5oLm-hUXryxV38OSAUJY3g&s', 'superadmin', '2026-03-25 15:08:37');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
