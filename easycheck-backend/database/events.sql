-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Apr 01, 2026 at 08:30 PM
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
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb3_unicode_ci,
  `date_thai` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `event_date` datetime NOT NULL,
  `event_time` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `icon` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT 'bi-calendar-event',
  `register_start` datetime NOT NULL,
  `register_end` datetime NOT NULL,
  `type` enum('internal','external') COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'internal',
  `max_participants` int DEFAULT '0',
  `current_participants` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date_thai`, `event_date`, `event_time`, `location`, `icon`, `register_start`, `register_end`, `type`, `max_participants`, `current_participants`, `created_at`, `updated_at`) VALUES
(1, 'งานวิ่งการกุศลประจำปี', 'ร่วมกิจกรรมวิ่งการกุศลเพื่อสังคม', '20 เมษายน 2569', '2026-04-20 06:00:00', '06:00 - 10:00', 'สวนสาธารณะเมือง', 'bi-activity', '2026-04-01 00:00:00', '2026-04-19 23:59:59', 'external', 100, 0, '2026-04-01 20:30:22', '2026-04-01 20:30:22'),
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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
