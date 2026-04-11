-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Apr 11, 2026 at 12:56 PM
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
  `id_employee` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสพนักงาน',
  `shift_id` int DEFAULT NULL,
  `work_date` date NOT NULL COMMENT 'วันที่ทำงาน',
  `check_in_time` datetime DEFAULT NULL COMMENT 'เวลาเข้างาน',
  `check_in_photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'พาร์ทไฟล์รูปตอนเข้างาน',
  `check_in_lat` decimal(10,8) DEFAULT NULL COMMENT 'ละติจูดตอนเข้า',
  `check_in_lng` decimal(11,8) DEFAULT NULL COMMENT 'ลองติจูดตอนเข้า',
  `check_in_status` enum('on_time','late') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'สถานะเข้างาน',
  `check_out_time` datetime DEFAULT NULL COMMENT 'เวลาออกงาน',
  `check_out_photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'พาร์ทไฟล์รูปตอนออกงาน',
  `check_out_lat` decimal(10,8) DEFAULT NULL COMMENT 'ละติจูดตอนออก',
  `check_out_lng` decimal(11,8) DEFAULT NULL COMMENT 'ลองติจูดตอนออก',
  `check_out_status` enum('normal','early') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'สถานะออกงาน',
  `early_leave_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'เหตุผลกรณีออกก่อนเวลา',
  `approval_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'approved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`id`, `name`) VALUES
(1, 'Bangkok'),
(2, 'Chiang Mai'),
(3, 'Phuket'),
(4, 'Chonburi'),
(5, 'Khon Kaen');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `date_thai` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'bi-calendar-event',
  `register_start` datetime NOT NULL,
  `register_end` datetime NOT NULL,
  `type` enum('internal','external') CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'internal',
  `max_participants` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date_thai`, `event_date`, `event_time`, `location`, `icon`, `register_start`, `register_end`, `type`, `max_participants`, `created_at`, `updated_at`) VALUES
(33, 'Kater', '<3 !', NULL, '2026-04-23', '16:26:00', 'SM', 'bi-calendar-event', '2026-04-03 21:01:00', '2026-04-09 23:59:00', 'external', 10, '2026-04-09 09:24:31', '2026-04-09 14:59:59'),
(34, 'tar', 'tar <3', NULL, '2026-04-07', '22:08:00', 'tar', 'bi-calendar-event', '2026-04-08 09:06:00', '2026-04-22 06:10:00', 'internal', 2, '2026-04-09 15:06:24', '2026-04-09 15:21:34');

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
  `registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('registered','cancelled') CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'registered'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `event_registrations`
--

INSERT INTO `event_registrations` (`id`, `event_id`, `id_employee`, `notes`, `registration_date`, `registered_at`, `status`) VALUES
(1, 33, '101010', '><', '2026-04-09', '2026-04-09 09:24:58', 'registered');

-- --------------------------------------------------------

--
-- Table structure for table `leave_policy`
--

CREATE TABLE `leave_policy` (
  `id` int NOT NULL,
  `leave_code` varchar(50) NOT NULL,
  `leave_name` varchar(100) NOT NULL,
  `max_days_per_year` int DEFAULT NULL,
  `require_evidence` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leave_policy`
--

INSERT INTO `leave_policy` (`id`, `leave_code`, `leave_name`, `max_days_per_year`, `require_evidence`, `active`) VALUES
(1, 'SICK', 'Sick Leave', 30, 1, 1),
(2, 'PERSONAL', 'Personal Leave', 3, 0, 1),
(3, 'VACATION', 'Vacation Leave', 6, 0, 1),
(4, 'MATERNITY', 'Maternity Leave', 120, 0, 1),
(5, 'WEDDING', 'Wedding Leave', 3, 0, 1),
(6, 'RELIGIOUS', 'Religious Leave', 3, 0, 1),
(7, 'OTHER', 'Other', 3, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` int NOT NULL,
  `id_employee` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `leave_start` date NOT NULL,
  `leave_end` date NOT NULL,
  `leave_days` int NOT NULL,
  `leave_reasons` json NOT NULL,
  `other_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `evidence_file` longblob,
  `evidence_mime` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reject_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` datetime DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `joindate` date NOT NULL,
  `position` enum('Budgeting & Planning Officer','Cybersecurity Specialist','Payroll Specialist','Content Marketing Executive','Customer Experience Analyst','Sales Coordinator','Key Account Manager','Content Creator','Motion Graphic Designer','Approver','Admin','Super Admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` enum('Finance','IT','Sales','Creative') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '/img/default.jpg',
  `shift_id` int NOT NULL,
  `branch_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `id_employee`, `role_id`, `firstname`, `lastname`, `gender`, `birthdate`, `joindate`, `position`, `department`, `email`, `password`, `phone`, `avatar`, `shift_id`, `branch_id`) VALUES
(1, '101010', 1, 'Taro', 'Yu', 'female', '2005-02-14', '2026-03-31', 'Cybersecurity Specialist', 'IT', 'pataraporn142548@gmail.com', '$2b$10$kCnA9ItsPUbqvDnaAfQ2vez8wBLlyhXb9DFpeC7wj92Vwx8.X/UP.', '0652939090', 'https://i.pinimg.com/736x/67/de/76/67de7632379015a3dc7e080148bd5d8f.jpg', 1, 1),
(2, '202020', 1, 'Bambi', 'Kang', 'female', '2006-06-11', '2026-03-31', 'Sales Coordinator', 'Sales', 'thitichatphoto@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0811235678', 'https://i.pinimg.com/736x/f5/f9/fb/f5f9fbdb8a74165249beda8b3de127c1.jpg', 2, 2),
(3, '303030', 2, 'Maemom', 'Young', 'female', '2006-02-08', '2026-03-31', 'Approver', 'Finance', 'compannaphat@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0876564732', 'https://i.pinimg.com/736x/fa/cd/a2/facda288a9633aade66c84642a8fcb6a.jpg', 3, 3),
(4, '404040', 3, 'Boobi', 'Bubu', 'male', '2005-02-13', '2026-03-31', 'Admin', 'Sales', 'thanik1265@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0976453421', 'https://i.pinimg.com/1200x/45/bf/0b/45bf0b9e7f509e025d61091f677189f3.jpg', 2, 4),
(5, '505050', 4, 'Meow', 'Whatislove', 'female', '2006-04-01', '2026-04-01', 'Admin', 'Creative', 'mo.sarasinee@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0894726153', 'https://i.pinimg.com/736x/8f/0d/1d/8f0d1ded2a11628c68891d1f268b5650.jpg', 3, 5),
(6, '606060', 2, 'Nayeon', 'Im', 'female', '1995-09-22', '2020-01-10', 'Approver', 'IT', 'imnayeon@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0811111111', 'https://i.pinimg.com/736x/37/4d/65/374d659f5ac5ede493283cf3f7a43e04.jpg', 3, 1),
(7, '707070', 2, 'Wonyoung', 'Jang', 'female', '2004-08-31', '2020-02-15', 'Approver', 'Sales', 'jangwonyoung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0822222222', 'https://i.pinimg.com/1200x/5d/b4/6e/5db46e4fc276d47db0cf2940c866aa35.jpg', 3, 2),
(8, '808080', 2, 'Hoseok', 'Jung', 'male', '1994-02-18', '2020-03-20', 'Approver', 'Finance', 'imurhope@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0833333333', 'https://i.pinimg.com/736x/e6/26/63/e62663463f107dd9cb1c17e44f18d703.jpg', 1, 4),
(9, '909090', 2, 'Asa', 'Enami', 'female', '2006-04-17', '2020-04-25', 'Approver', 'Creative', 'enamiasa@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0844444444', 'https://i.pinimg.com/736x/bc/d7/f0/bcd7f05c5b3e1a0dec4bb1a3d77da181.jpg', 2, 5),
(10, '101011', 1, 'Jimin', 'Yu', 'female', '2000-04-11', '2022-06-01', 'Sales Coordinator', 'Sales', 'katarina@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111111', 'https://i.pinimg.com/736x/8a/a7/df/8aa7df488e02318d04300141a7b67d74.jpg', 3, 1),
(11, '111111', 1, 'Minjeong', 'Kim', 'female', '2001-01-01', '2022-06-15', 'Customer Experience Analyst', 'Sales', 'imwinter@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111112', 'https://i.pinimg.com/1200x/73/73/36/737336e8d1c70104558d68f3e177301c.jpg', 2, 1),
(12, '121212', 1, 'Aeri', 'Uchinaga', 'female', '1994-03-20', '2022-07-01', 'Content Creator', 'Creative', 'aerichandesu@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111113', 'https://i.pinimg.com/736x/79/ee/78/79ee78b5ffae707c7eaa69003caa94f8.jpg', 1, 1),
(13, '131313', 1, 'Yizhuo', 'Ning', 'other', '2002-10-23', '2022-07-15', 'Payroll Specialist', 'Finance', 'imnotningning@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111114', 'https://i.pinimg.com/736x/9a/53/5b/9a535b976efaff03c645547544675bcf.jpg', 3, 1),
(14, '141414', 1, 'Minji', 'Kim', 'other', '2004-05-07', '2022-08-01', 'Key Account Manager', 'Sales', 'kimminji@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111115', 'https://i.pinimg.com/736x/49/d5/75/49d575becbd7b91cb8da9368a3159b49.jpg', 2, 2),
(15, '151515', 1, 'Hanni', 'Pham', 'female', '2004-10-06', '2022-08-15', 'Motion Graphic Designer', 'Creative', 'phamhanni@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111116', 'https://i.pinimg.com/736x/a5/3d/90/a53d90569754484b38090a9a9f1276e6.jpg', 1, 2),
(16, '161616', 1, 'Danielle', 'Marsh', 'female', '2005-04-11', '2022-09-01', 'Cybersecurity Specialist', 'IT', 'daniellemarsh@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111117', 'https://i.pinimg.com/736x/e0/38/df/e038df6f013e1d17998c268365798761.jpg', 1, 2),
(17, '171717', 1, 'Haerin', 'Kang', 'female', '2006-05-15', '2022-06-01', 'Sales Coordinator', 'Sales', 'kanghaerin@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222221', 'https://i.pinimg.com/1200x/21/b5/6d/21b56d80000c6d466687a849beeaeb53.jpg', 2, 2),
(18, '181818', 1, 'Hyein', 'Lee', 'female', '2008-04-21', '2022-06-15', 'Customer Experience Analyst', 'Sales', 'leehyein@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222222', 'https://i.pinimg.com/736x/11/5f/93/115f9366cf68b2bf9653ff0c47e56ae0.jpg', 1, 2),
(19, '191919', 1, 'Taeyeon', 'Kim', 'female', '1989-03-09', '2022-07-01', 'Content Creator', 'Creative', 'kimtaeyeon@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222223', 'https://i.pinimg.com/1200x/95/fb/62/95fb6213569678da461c58d99edf4d12.jpg', 2, 3),
(20, '202022', 1, 'Sooyoung', 'Choi', 'female', '1990-02-10', '2022-07-15', 'Payroll Specialist', 'Finance', 'choisooyoung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222224', 'https://i.pinimg.com/1200x/bf/8f/e1/bf8fe1d2e588e81c5b2d04e1a26f8326.jpg', 3, 3),
(21, '212121', 1, 'Minyoung', 'Hwang', 'female', '1989-08-01', '2022-08-01', 'Key Account Manager', 'Sales', 'tiffanyyoung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222225', 'https://i.pinimg.com/1200x/10/24/71/102471f7333ae9e68834889ef44a7179.jpg', 1, 3),
(22, '222222', 1, 'Hyoyeon', 'Kim', 'female', '1989-09-22', '2022-08-15', 'Motion Graphic Designer', 'Creative', 'HYO@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222226', 'https://i.pinimg.com/1200x/07/5e/bf/075ebf90c4af8930e5d02dd5c6c792db.jpg', 3, 3),
(23, '232323', 1, 'Shotaro', 'Osaki', 'male', '2000-09-25', '2022-09-01', 'Cybersecurity Specialist', 'IT', 'shotarokung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0902222227', 'https://i.pinimg.com/736x/c0/2e/1b/c02e1be8bea5530a371e42a7b730b016.jpg', 1, 4),
(24, '242424', 1, 'Eunseok', 'Song', 'male', '2001-03-19', '2022-06-01', 'Sales Coordinator', 'Sales', 'jacksong@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333331', 'https://i.pinimg.com/1200x/c9/6c/13/c96c1326d9785bb8c57decdac17a8f40.jpg', 3, 4),
(25, '252525', 1, 'Sungchan', 'Jung', 'male', '2001-09-13', '2022-06-15', 'Customer Experience Analyst', 'Sales', 'nongchicha@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333332', 'https://i.pinimg.com/736x/cf/17/d2/cf17d22027c0d34e213f6a6f8ca901fa.jpg', 2, 4),
(26, '262626', 1, 'Wonbin', 'Park', 'male', '2002-03-02', '2022-07-01', 'Content Creator', 'Creative', 'parkwonbin@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333333', 'https://i.pinimg.com/736x/b8/17/e9/b817e93aa7ae2242d2bc16aeaf2c0d5c.jpg', 2, 4),
(27, '272727', 1, 'Seunghan', 'Hong', 'male', '2003-10-02', '2022-07-15', 'Payroll Specialist', 'Finance', 'sohomraisanim@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333334', 'https://i.pinimg.com/736x/be/f5/66/bef5663a2b2109e7ebf77e30fc8ff10c.jpg', 1, 4),
(28, '282828', 1, 'Sohee', 'Lee', 'male', '2003-11-21', '2022-08-01', 'Key Account Manager', 'Sales', 'sorakkaohom@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333335', 'https://i.pinimg.com/736x/3d/e2/c3/3de2c301e6b2c7ce472047ebc7935442.jpg', 2, 4),
(29, '292929', 1, 'Chanyoung', 'Lee', 'male', '2004-03-21', '2022-08-15', 'Motion Graphic Designer', 'Creative', 'antonylee@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333336', 'https://i.pinimg.com/736x/a5/a4/13/a5a4133fe4c389e91fc8465fd6647975.jpg', 3, 4),
(30, '303031', 1, 'Anatchaya', 'Suputhipong', 'other', '2002-05-30', '2022-09-01', 'Cybersecurity Specialist', 'IT', 'natty@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0903333337', 'https://i.pinimg.com/736x/d2/6e/18/d26e181d2da7f8eb6dcab16dadbbd9b2.jpg', 2, 5),
(31, '313131', 1, 'Julie', 'Han', 'female', '1995-01-10', '2022-06-01', 'Sales Coordinator', 'Sales', 'juliehan@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0904444441', 'https://i.pinimg.com/1200x/0a/a1/56/0aa1563ba34a413d6bf8b8a4ef309eac.jpg', 2, 5),
(104, '010101', 3, 'Evangeline', 'Rose', 'female', '2005-09-16', '2026-04-02', 'Content Marketing Executive', 'Sales', 'Evangeline875@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0955842525', 'https://i.pinimg.com/1200x/e2/f4/09/e2f409f9d3c9c7c4dc190d407f1fe1c1.jpg', 1, 4),
(105, '020202', 3, 'Sienna', 'Davenport', 'female', '2005-03-22', '2026-03-31', 'Approver', 'Creative', 'Sienna832@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0654859722', 'https://i.pinimg.com/736x/d3/c0/30/d3c0309c9803371481123563bad5a99a.jpg', 1, 5),
(106, '030303', 1, 'Valentin', 'Sinclair', 'male', '2005-01-19', '2026-04-02', 'Approver', 'Finance', 'Valentin741@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0368794456', 'https://i.pinimg.com/736x/ad/e3/0c/ade30c662d92b862c67a9902384f9e98.jpg', 1, 3),
(109, '323232', 1, 'Hyewon', 'Shim', 'other', '2004-03-20', '2026-04-06', 'Budgeting & Planning Officer', 'Finance', 'princessbell@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0812345678', 'https://i.pinimg.com/736x/a1/f8/e9/a1f8e96f6bb7fde4f7e730381032574b.jpg', 3, 5),
(110, '333333', 1, 'Haneul', 'Won', 'other', '2005-05-25', '2026-04-03', 'Content Creator', 'Creative', 'bobsky@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0857486793', 'https://i.pinimg.com/736x/ac/2d/5f/ac2d5f458f05bcf8593d952f193b6c00.jpg', 1, 5),
(111, '343434', 3, 'Dechawat', 'Pondechapiphat', 'male', '2006-04-18', '2026-04-07', 'Payroll Specialist', 'IT', 'copper.cu@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0812345678', 'https://i.pinimg.com/736x/35/38/7c/35387cea6cca6db614f419018c1c79ac.jpg', 3, 1),
(112, '353535', 3, 'Mark', 'Lee', 'male', '1999-08-02', '2026-04-07', 'Admin', 'Creative', 'onyourmark@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0878901234', 'https://i.pinimg.com/736x/c2/82/dc/c282dc23b0a49d3a6ec3b9c392788027.jpg', 3, 2),
(121, '363636', 3, 'Jacqueline', 'Muench', 'other', '1993-10-21', '2026-04-07', 'Admin', 'Creative', 'jackie@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0812345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPqwLHAYXWU4aPlT5eWFWIwWGBykbLOx49Qw&s', 2, 3);

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
-- Dumping data for table `User_shifts`
--

INSERT INTO `User_shifts` (`role_id`, `shift_id`, `id`) VALUES
(1, 1, 1),
(1, 1, 2),
(1, 3, 16),
(1, 1, 27);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_date` (`id_employee`,`work_date`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
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
-- Indexes for table `leave_policy`
--
ALTER TABLE `leave_policy`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leave_code` (`leave_code`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee` (`id_employee`);

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
  ADD KEY `role_id` (`role_id`),
  ADD KEY `shift_id` (`shift_id`),
  ADD KEY `users_ibfk_branch` (`branch_id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `leave_policy`
--
ALTER TABLE `leave_policy`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

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
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_branch` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_shift` FOREIGN KEY (`shift_id`) REFERENCES `Shifts` (`shift_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
