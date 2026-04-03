-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Apr 03, 2026 at 02:48 AM
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
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `date_thai` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `event_date` datetime NOT NULL,
  `event_time` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT 'bi-calendar-event',
  `register_start` datetime NOT NULL,
  `register_end` datetime NOT NULL,
  `type` enum('internal','external') CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'internal',
  `max_participants` int DEFAULT '0',
  `current_participants` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date_thai`, `event_date`, `event_time`, `location`, `icon`, `register_start`, `register_end`, `type`, `max_participants`, `current_participants`, `created_at`, `updated_at`) VALUES
(1, 'งานวิ่งการกุศลประจำปี', 'ร่วมกิจกรรมวิ่งการกุศลเพื่อสังคม', '20 เมษายน 2569', '2026-04-20 06:00:00', '06:00 - 10:00', 'สวนสาธารณะเมือง', 'bi-activity', '2026-04-01 00:00:00', '2026-04-19 23:59:59', 'external', 100, 1, '2026-04-01 20:30:22', '2026-04-02 22:26:03'),
(2, 'สัมมนาเทรนด์ธุรกิจปี 2026', 'สัมมนาแนวโน้มธุรกิจและการตลาด', '25 เมษายน 2569', '2026-04-25 09:00:00', '09:00 - 17:00', 'โรงแรม Grand Palace', 'bi-graph-up', '2026-04-05 00:00:00', '2026-04-24 23:59:59', 'external', 50, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(3, 'กิจกรรม CSR ร่วมกับชุมชน', 'ทำกิจกรรมเพื่อสังคมร่วมกับชุมชน', '30 เมษายน 2569', '2026-04-30 08:30:00', '08:30 - 15:30', 'โรงเรียนบ้านหนองบัว', 'bi-heart', '2026-04-10 00:00:00', '2026-04-29 23:59:59', 'external', 30, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(4, 'ประชุมผู้ถือหุ้นประจำปี', 'ประชุมใหญ่สามัญประจำปี', '5 พฤษภาคม 2569', '2026-05-05 13:00:00', '13:00 - 16:30', 'โรงแรม The Plaza', 'bi-people', '2026-04-15 00:00:00', '2026-05-04 23:59:59', 'external', 200, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(5, 'อบรมเทคนิคการตลาดดิจิทัล', 'อบรมเชิงปฏิบัติการการตลาดออนไลน์', '10 พฤษภาคม 2569', '2026-05-10 10:00:00', '10:00 - 16:00', 'ศูนย์ฝึกอบรม AIA Tower', 'bi-laptop', '2026-04-20 00:00:00', '2026-05-09 23:59:59', 'external', 40, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(6, 'งานแสดงสินค้าและนวัตกรรม', 'แสดงสินค้าและนวัตกรรมใหม่', '15 พฤษภาคม 2569', '2026-05-15 10:00:00', '10:00 - 18:00', 'ศูนย์ประชุมแห่งชาติสิริกิติ์', 'bi-lightbulb', '2026-04-25 00:00:00', '2026-05-14 23:59:59', 'external', 500, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(7, 'อบรมความปลอดภัยในการทำงาน', 'อบรมมาตรการความปลอดภัยในสถานประกอบการ', '20 พฤษภาคม 2569', '2026-05-20 09:00:00', '09:00 - 12:00', 'ห้องประชุมใหญ่ อาคาร A', 'bi-shield-check', '2026-05-01 00:00:00', '2026-05-19 23:59:59', 'internal', 50, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(8, 'บริจาคโลหิตประจำปี', 'ร่วมบริจาคโลหิตเพื่อช่วยเหลือผู้อื่น', '25 พฤษภาคม 2569', '2026-05-25 08:30:00', '08:30 - 16:00', 'ห้องประชุมกลาง ชั้น 3', 'bi-droplet', '2026-05-05 00:00:00', '2026-05-24 23:59:59', 'internal', 30, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(9, 'Workshop การทำงานเป็นทีม', 'พัฒนาทักษะการทำงานร่วมกันเป็นทีม', '30 พฤษภาคม 2569', '2026-05-30 13:00:00', '13:00 - 17:00', 'ห้องอบรม อาคาร B', 'bi-people', '2026-05-10 00:00:00', '2026-05-29 23:59:59', 'internal', 40, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(10, 'อบรมการใช้ซอฟต์แวร์ใหม่', 'อบรมการใช้งานโปรแกรมระบบใหม่', '5 มิถุนายน 2569', '2026-06-05 10:00:00', '10:00 - 15:00', 'ห้องคอมพิวเตอร์ ชั้น 2', 'bi-laptop', '2026-05-15 00:00:00', '2026-06-04 23:59:59', 'internal', 25, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(11, 'กิจกรรมสร้างความสัมพันธ์พนักงาน', 'กิจกรรม Team Building ภายในบริษัท', '10 มิถุนายน 2569', '2026-06-10 16:00:00', '16:00 - 19:00', 'สวนหย่อม อาคาร A', 'bi-heart', '2026-05-20 00:00:00', '2026-06-09 23:59:59', 'internal', 60, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(12, 'งานเปิดตัวสินค้า', 'เปิดตัวสินค้าตัวใหม่ประจำปี', '15 มิถุนายน 2569', '2026-06-15 14:00:00', '14:00 - 17:30', 'ห้องประชุม C', 'bi-megaphone', '2026-05-25 00:00:00', '2026-06-14 23:59:59', 'internal', 80, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(13, 'อบรมเทคนิคการสื่อสารภายในองค์กร', 'พัฒนาทักษะการสื่อสารในที่ทำงาน', '20 มิถุนายน 2569', '2026-06-20 09:30:00', '09:30 - 16:30', 'ห้องประชุมใหญ่ อาคาร A', 'bi-chat-dots', '2026-06-01 00:00:00', '2026-06-19 23:59:59', 'internal', 45, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(14, 'กิจกรรมกีฬาเพื่อสุขภาพ', 'กิจกรรมกีฬาสานสัมพันธ์พนักงาน', '25 มิถุนายน 2569', '2026-06-25 08:00:00', '08:00 - 11:00', 'สนามกีฬาในบริษัท', 'bi-activity', '2026-06-05 00:00:00', '2026-06-24 23:59:59', 'internal', 100, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(15, 'Workshop การแก้ไขปัญหาเชิงสร้างสรรค์', 'เรียนรู้เทคนิคการแก้ปัญหาอย่างสร้างสรรค์', '28 มิถุนายน 2569', '2026-06-28 13:30:00', '13:30 - 16:30', 'ห้องอบรม อาคาร B', 'bi-lightbulb', '2026-06-08 00:00:00', '2026-06-27 23:59:59', 'internal', 35, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
(16, 'งานเลี้ยงบริษัท', 'งานเลี้ยงส่งท้ายไตรมาส', '30 มิถุนายน 2569', '2026-06-30 18:00:00', '18:00 - 21:00', 'ห้องประชุมใหญ่ อาคาร A', 'bi-cup-straw', '2026-06-10 00:00:00', '2026-06-29 23:59:59', 'internal', 150, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22');

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `id_employee` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `registration_date` date NOT NULL,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('registered','cancelled') CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT 'registered'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

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
(5, '505050', 4, 'Meow', 'Whatislove', 'female', '2006-04-01', '2026-04-01', 'Super Admin', 'Creative', 'Khon Kaen', 'mo.sarasinee@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0894726153', 'https://i.pinimg.com/736x/8f/0d/1d/8f0d1ded2a11628c68891d1f268b5650.jpg'),
(6, '060606', 2, 'Nayeon', 'Im', 'female', '1995-09-22', '2020-01-10', 'Approver', 'IT', 'Bangkok', 'imnayeon@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0811111111', 'https://i.pinimg.com/736x/37/4d/65/374d659f5ac5ede493283cf3f7a43e04.jpg'),
(7, '070707', 2, 'Wonyoung', 'Jang', 'female', '2004-08-31', '2020-02-15', 'Approver', 'Sales', 'Chiang Mai', 'jangwonyoung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0822222222', 'https://i.pinimg.com/1200x/5d/b4/6e/5db46e4fc276d47db0cf2940c866aa35.jpg'),
(8, '080808', 2, 'Hoseok', 'Jung', 'male', '1994-02-18', '2020-03-20', 'Approver', 'Finance', 'Khon Kaen', 'imuourhope@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0833333333', 'https://i.pinimg.com/736x/e6/26/63/e62663463f107dd9cb1c17e44f18d703.jpg'),
(9, '090909', 2, 'Asa', 'Enami', 'female', '2006-04-17', '2020-04-25', 'Approver', 'Creative', 'Chonburi', 'enamiasa@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0844444444', 'https://i.pinimg.com/736x/bc/d7/f0/bcd7f05c5b3e1a0dec4bb1a3d77da181.jpg'),
(10, '101011', 1, 'Jimin', 'Yu', 'female', '2000-04-11', '2022-06-01', 'Sales Coordinator', 'Sales', 'Bangkok', 'katarina@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111111', 'https://i.pinimg.com/736x/8a/a7/df/8aa7df488e02318d04300141a7b67d74.jpg'),
(11, '111111', 1, 'Minjeong', 'Kin', 'female', '2001-01-01', '2022-06-15', 'Customer Experience Analyst', 'Sales', 'Bangkok', 'imwinter@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111112', 'https://i.pinimg.com/736x/d1/57/50/d15750df7ab3fe280de046678aeb856e.jpg'),
(12, '121212', 1, 'Aeri', 'Uchinaga', 'female', '1994-03-20', '2022-07-01', 'Content Creator', 'Creative', 'Bangkok', 'aerichandesu@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111113', 'https://i.pinimg.com/736x/79/ee/78/79ee78b5ffae707c7eaa69003caa94f8.jpg'),
(13, '131313', 1, 'Ning', 'Yizhuo', 'other', '2002-10-23', '2022-07-15', 'Payroll Specialist', 'Finance', 'Bangkok', 'imnotningning@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111114', 'https://i.pinimg.com/736x/18/0f/5f/180f5f5668badf8c617a66e122cf221c.jpg'),
(14, '141414', 1, 'MInji', 'Kim', 'other', '2004-05-07', '2022-08-01', 'Key Account Manager', 'Sales', 'Bangkok', 'kimminji@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111115', 'https://i.pinimg.com/736x/49/d5/75/49d575becbd7b91cb8da9368a3159b49.jpg'),
(15, '151515', 1, 'Hanni', 'Pham', 'female', '2004-10-06', '2022-08-15', 'Motion Graphic Designer', 'Creative', 'Chiang Mai', 'phamhanni@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111116', 'https://i.pinimg.com/736x/a5/3d/90/a53d90569754484b38090a9a9f1276e6.jpg'),
(16, '161616', 1, 'Danielle', 'Marsh', 'female', '2005-04-11', '2022-09-01', 'Cybersecurity Specialist', 'IT', 'Chiang Mai', 'daniellemarsh@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111117', 'https://i.pinimg.com/736x/e0/38/df/e038df6f013e1d17998c268365798761.jpg'),
(17, '171717', 1, 'Haerin', 'Kang', 'female', '2006-05-15', '2022-06-01', 'Sales Coordinator', 'Sales', 'Chiang Mai', 'kanghaerin@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222221', 'https://i.pinimg.com/1200x/21/b5/6d/21b56d80000c6d466687a849beeaeb53.jpg'),
(18, '181818', 1, 'Hyein', 'Lee', 'female', '2008-04-21', '2022-06-15', 'Customer Experience Analyst', 'Sales', 'Chiang Mai', 'leehyein@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222222', 'https://i.pinimg.com/736x/11/5f/93/115f9366cf68b2bf9653ff0c47e56ae0.jpg'),
(19, '191919', 1, 'Taeyeon', 'Kim', 'female', '1989-03-09', '2022-07-01', 'Content Creator', 'Creative', 'Phuket', 'kimtaeyeon@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222223', 'https://i.pinimg.com/1200x/95/fb/62/95fb6213569678da461c58d99edf4d12.jpg'),
(20, '202022', 1, 'Sooyoung', 'Choi', 'female', '1990-02-10', '2022-07-15', 'Payroll Specialist', 'Finance', 'Phuket', 'choisooyoung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222224', 'https://i.pinimg.com/1200x/bf/8f/e1/bf8fe1d2e588e81c5b2d04e1a26f8326.jpg'),
(21, '212121', 1, 'Minyoung', 'Hwang', 'female', '1989-08-01', '2022-08-01', 'Key Account Manager', 'Sales', 'Phuket', 'tiffanyyoung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222225', 'https://i.pinimg.com/1200x/10/24/71/102471f7333ae9e68834889ef44a7179.jpg'),
(22, '222222', 1, 'Hyoyeon', 'Kim', 'female', '1989-09-22', '2022-08-15', 'Motion Graphic Designer', 'Creative', 'Phuket', 'HYO@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222226', 'https://i.pinimg.com/1200x/07/5e/bf/075ebf90c4af8930e5d02dd5c6c792db.jpg'),
(23, '232323', 1, 'Shotaro', 'Osaki', 'male', '2000-09-25', '2022-09-01', 'Cybersecurity Specialist', 'IT', 'Chonburi', 'shotarokung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222227', 'https://i.pinimg.com/736x/c0/2e/1b/c02e1be8bea5530a371e42a7b730b016.jpg'),
(24, '242424', 1, 'Eunseok', 'Song', 'male', '2001-03-19', '2022-06-01', 'Sales Coordinator', 'Sales', 'Chonburi', 'jacksong@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333331', 'https://i.pinimg.com/1200x/c9/6c/13/c96c1326d9785bb8c57decdac17a8f40.jpg'),
(25, '252525', 1, 'Sungchan', 'Jung', 'male', '2001-09-13', '2022-06-15', 'Customer Experience Analyst', 'Sales', 'Chonburi', 'nongchicha@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333332', 'https://i.pinimg.com/736x/cf/17/d2/cf17d22027c0d34e213f6a6f8ca901fa.jpg'),
(26, '262626', 1, 'Wonbin', 'Park', 'male', '2002-03-02', '2022-07-01', 'Content Creator', 'Creative', 'Chonburi', 'parkwonbin@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333333', 'https://i.pinimg.com/736x/b8/17/e9/b817e93aa7ae2242d2bc16aeaf2c0d5c.jpg'),
(27, '272727', 1, 'Seunghan', 'Hong', 'male', '2003-10-02', '2022-07-15', 'Payroll Specialist', 'Finance', 'Chonburi', 'sohomraisanim@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333334', 'https://i.pinimg.com/736x/be/f5/66/bef5663a2b2109e7ebf77e30fc8ff10c.jpg'),
(28, '282828', 1, 'Sohee', 'Lee', 'male', '2003-11-21', '2022-08-01', 'Key Account Manager', 'Sales', 'Chonburi', 'sorakkaohom@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333335', 'https://i.pinimg.com/736x/3d/e2/c3/3de2c301e6b2c7ce472047ebc7935442.jpg'),
(29, '292929', 1, 'Chanyoung', 'Lee', 'male', '2004-03-21', '2022-08-15', 'Motion Graphic Designer', 'Creative', 'Chonburi', 'antonylee@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333336', 'https://i.pinimg.com/736x/a5/a4/13/a5a4133fe4c389e91fc8465fd6647975.jpg'),
(30, '303031', 1, 'Anatchaya', 'Suputhipong', 'other', '2002-05-30', '2022-09-01', 'Cybersecurity Specialist', 'IT', 'Khon Kaen', 'natty@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333337', 'https://i.pinimg.com/736x/d2/6e/18/d26e181d2da7f8eb6dcab16dadbbd9b2.jpg'),
(31, '313131', 1, 'Julie', 'Han', 'female', '1995-01-10', '2022-06-01', 'Sales Coordinator', 'Sales', 'Khon Kaen', 'juliehan@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0904444441', 'https://i.pinimg.com/736x/e1/35/90/e1359059825038a8e55239f9d80a39ec.jpg');

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
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`event_id`,`id_employee`),
  ADD KEY `id_employee_2` (`id_employee`);

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
  ADD UNIQUE KEY `idx_id_employee` (`id_employee`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `User_shifts`
--
ALTER TABLE `User_shifts`
  ADD KEY `role_id` (`role_id`,`shift_id`),
  ADD KEY `id` (`id`),
  ADD KEY `shift_id` (`shift_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`id_employee`) REFERENCES `Users` (`id_employee`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_registrations_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

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
