-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql

-- Generation Time: Apr 06, 2026 at 03:18 PM

-- Generation Time: Apr 06, 2026 at 06:53 PM
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
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (
( `id`, `title`, `date`, `description`, `created_at`) VALUES
(1, 'kater', '2026-04-15', 'katerkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkaterkater', '2026-04-02 21:45:26'),
(2, 'น่าหนาว', '2026-04-07', 'น่าหนาวน่าหนาวน่าหนาวน่าหนาวน่าหนาวน่าหนาวน่าหนาวน่าหนาวน่าหนาวน่าหนาวน่าหนาว', '2026-04-10 21:45:26');
  `id_employee` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `photo` longblob,
  `approval_status` varchar(20) DEFAULT 'pending',
  `reject_reason` text,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `id_employee`, `type`, `status`, `photo`, `approval_status`, `reject_reason`, `created_at`) VALUES
(58, '101010', 'checkin', 'ontime', 0x75706c6f6164735c617474656e64616e63655c617474656e64616e63652d3130313031302d313737353530313333343335362d3631353733353735332e6a7067, 'pending', NULL, '2026-04-06 18:48:54');

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
>>>>>>> a7e11610c57c0e799961f7d9c014c935b2872662

-- --------------------------------------------------------

--
-- Table structure for table `Event_participants`
--

CREATE TABLE `Event_participants` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `id_employee` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--

-- Dumping data for table `Event_participants`
--

INSERT INTO `Event_participants` (`id`, `event_id`, `id_employee`) VALUES
(1, 1, '101010'),
(3, 1, '303030'),
(4, 1, '404040'),
(2, 2, '202020'),
(5, 2, '505050');

-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `user_id`, `leave_start`, `leave_end`, `leave_reasons`, `other_reason`, `evidence_file`, `status`, `reject_reason`, `created_at`) VALUES
(1, '061004', '2026-04-07', '2026-04-10', '[\"Sick Leave\"]', NULL, 0xffd8ffe000104a46494600010100000100010000ffdb0084000906071010121210121210121010101510151015100f0f1015101515161615111515181d2820181a251d151521312125292b2e2e2e171f3538332c37282d2e2b010a0a0a0e0d0e1b1010182d1d1d1d2d2b2b2b2d2b2d2d2d2b2d2d2d2d2b2b2d2d2d2d2d2d2d2d2d2d2b2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d372d2d2d372d2b2bffc000110800e100e103012200021101031101ffc4001c0000010501010100000000000000000000050002030406010708ffc4004510000102030405080608050305000000000100020304110512213141516171910613223281a1b1c1425272b2d1f007142333627382c2637492a2e12443b315163453f1ffc4001a010002030101000000000000000000000002030001040506ffc40026110002020202020105000300000000000000010211033104213241121314225161052371ffda000c03010002110311003f00d54f2071b3ed47279038bd6ed58e61c406feb1f68f8a21647de0f9d050e399f68f8a2763fdef1f029d8fd152344875ac7a2ef60f884450db63aaef67f705ade8cc8cfb51bb13d1fce67bf0879a0ad46ec21d28635c767fcb05261b1b2d1ea69af4e40396dca587674b3a3388311d5642864e2f894d5a8667fca7dd18f6ca3cade58cad9e28f25f18b6a203297e8722e39346fd58557915b5f49b3f189e6ded80cd0d86017536bdd9f65166a726624c39f1623dcf8b15c5ee27124ebf9c8510c8aca253c8d9aa18525df61d99e55cfc46dd7cd47734e8bc0778c50974d3c9c5ce3bc92a202addcbb2f128766eaa0639245f64dbd82b7dcd39820907882b49c9dfa4098834645a46875271a3628a9a921fa771e2b2b342ada8c3b69dca9b4905526d689249ecf7193b5614d379c86ea8d20e0e69d44685725c62bc6ec5b56240787c3342302d3d5737d5217ac727ed264cb1b119a702dd2d769694f8caf62250a3552f9056e1aa90342b90d6a466648d5e73cac3feae36f6ff00c6d5e8c179b72a0d66e3fb60706b424f23c4661f22ac8f5bb5bef05b2e4d0ff4d5d715e7c16364b3ed1e2b69c9effc587ed3cff724e0d8ecda14c9c540a599cd42d4f7b10823243144d886c92270c26474048b3721fac782ea868922afe9466e77240e367da8e4ee48145cd712674a00471c4ef3e288d8df79f3a90c6a276375c6ff0024ec6548d1a1b6cf54fb23de0889436d8ea9dc3de0b5bd1996c02d472c01d383fcc33fe585f040c23bc9ff00bc97fe619ef03e4930d8d968f4c9a986c263e23cd190da5ee3a9ad1527805f3172bb941127e65f30f24824b61b09c190abd1601a36eb355edff4a96b365ecf8c2f86c48c3996330abefd03c01b1b535d8be738910b4a6647e85618fb2c12e06f65f049c5afcf03f38a861bce9f4bc1284003afc128d48888a1a28cba8ac4569bc15e99817ba400029906aab27c4a70630a68aed3e4b861fceb0b9cd1ae5dcac476d294c34eed8aacba2bd48c4538235c94b7624b476baf7d9bdcd6c46e8bb5a5ede2a8212940eb0deaec16acfa5a55d50372bd0d79ff00d1bdbce8cdfabc4357c36d5a4e6580d29d950bd061add8e5f25661c91f8ba246af31e503ab331cff0015ddc69e4bd3dabcb6d935988ff9d13de28391e21e0f21b25af68f02b6b608ff004b0b6df3fdc562654e07b7dd2b71638a4ac1dce3fdee4ac1b199b441319a898a48f9a643cd35ec484a49148610d92089c34e8e8090fa249c92bb04cbcea031b347a78a031f32b8933a5001b115b1474c6ff24299a117b13adf3a93f1eca907ca176c1e89ecf1289a176ce5fd3e25697a33ad8111de4f8fb497fcf69ef77c10208dd8730d86f84f7101ac7de24e0301112a1b1b2d1e6dcb8e50bed09b8910d44369e6a0c3f5580eaf59c713d8342cdcdc12d750f156a7660f3b1228342e8ae702283324d40ed55cc5bd86a5527d8705484d341e6b97e89af56acb91746780061a4a161a45eb1e45d18d48a34695b091b21a07c5724a4ee34002802292b824b958f51a00dabc9f1d66d01d828164e7213812d70a3b41d057a5c735c107b4aca6c514231d074853e45b479eb9a42ec0e89076d079a3d3962bdb5381a20262dea614bb82646562251a37df46d10fd758d1e9427d760001af82f6586bc93e88641ee8b12648e8359cd03adce2d710370038af5c8616de3afc4c7c87f912357955a86b1a31fe344f7caf56685e4d3a7ed227e63fde2a727c50383c87cb754ee77bab75668a4b41f609e2e72c2cb647d97792deca0a40823f84defa9f34bc1b199b4518f9a6c238a747cd32084d7b12169244e1a1b2289c34e8e8091224924ac132b3c8145cd1b9e72091735c499d38811a116b13ac379f04259a116b0fac3b7c13f1ec19683a85db597f4fee454a116d1c3b5be0e5a5e8cf1d81c2a1cad980c9402a439ce01b4c34bc93c02be167797b1bece0375de3df4f349438c55eae3994da1cc2eb703885d86711aaaa068eb0d4af42e4fca3590da40c48cd649d653d84923002b5d1ad6d6c1c60b772549a63a31687cddab0a16043c9d8c3e699079492d95e2d3f89a42ad6b4acc17001d76193d270179e06c0809b3a298cfc5d701e8d487878ae1a30a8e050a561dd1b48738c78bcd208d6153b4ed764119171d43e29965c91048cb0aaaf316607de2f15c1c06c76201a5286883d84c1cdb5a24c3aeb4c2603adc0959d7c93b9d7340a9be453b569ac9e4f063817806ee20814c76aa2d962678d05473e30d951826aa5a132baecf63e48c8b604bc28400ab5a2f529d7389c466b470d0db3615c606ea1444a1ae9e35513973772256e6bc8a60d5ee3adee3de57ae82bc7de713bd2793a43306d96a57271fc0ef16adfc31485087f059ee858197eabbd83ef357a0c4146306a84c1fda10e00f302a3669424a2e694246f6282f239222c43e4b244589f1d01224a24bab8a02642d10833f346ad140a21c5716674e20766845ec1eb0de7c1076e4118b073e3e09f8f60cb41c2845b397ea1e0e45ca0d6c9c3f50f74ad32d19e3b04accf2e611b905da2a471c7c8ad38570f2745a0d6cbdeb8e22ad7d2b4706c4cc691a1252b1d75d9e3b318e3afc542d2bd066fe8c6d161743e6e1383728a23503b51baec45562e6249f01ee645610f6e05a7020edd889c5ad84a49e83d256d4212d7623898ad2181b424b998d0eac30d2118e4e4c000007a24546e2b0246e0b4fc9b8a6e534b4d3b12271aecd1095f46e490e51fd59a3154e0cca99f3048a04ab1d45c94843adad4008bc46d5132d686da34d5a40a748103b0e45577cd8792e6f547a5a09d4151545d76606b57393bc9f870e23a33ba711cebd539024d6807ce4a9d8ec2f7de39331ed3979ad4d9c315a7042fb664e4e4afc5072005721aa9015b62e9239ac7bce0771f05e3ebd7660f41fec3bc0af220b3f27487f1f6cbb2dd477b1fbc2f439b14a0d4d03805e792dd477b23de2bd0e77328707b2f37a03c55d84b911760a3f62c33259220c43e4b244189f1d0b64954971250a3151a65af187039a1510e2ab4d467b48d5502ad0e710e39175320aec684482ea659f0cd715a6d59d44a8040a336067c5056a376067d8e4fc7b172d065c506b63f70f7519720d6c7eefdab44b4263b05b56b3919f7f0bd877b8ef8aca356b79163ede16c86f3fdacf8a5c361cfc4dec484d702d700e045082011459bb6391125326f4565f232bee73a835678f6ad3a6bd68464ba3292bc9492961721408403b33cdb4d762f39e5e4bc39799a42635ad870db79ad6868abaae2683616af4cb7f9512f2d56d4448c3fda69181fc6ec9be3b1795dab32e9888f8b1285d10d4ead400d80003b12b9138fc3e3ecd5c58c9cfe4f456978a1c2a3229d30e8ad179974d3d120d4ee283c66be59d518c32786c4564a7d910678ead2b9e74d328c6b5223853ec7716b89e0558b35af895739c48ad1ad0035b5d8066aeba4e09c4804ed56ecb9986c880dda86621a30c7207b112efa199324147a8f61f9294e6981be91c5ded1d1d9922b67e687b261b13169ecc8a2167e6ba10495247166db6db0e4056d8a9c05718b5233b239cfbb89f96ff74af255eb33f8428bf94ff74af2659b93e87f1f6cbb2dd576e6fbce5e873f995e7d263a27f48ef72f40b4732a60d32f37a03c429d0947113e022161a92c910621f279220c4f5a16c9125c5d5003cba6c569b1cd3df4ff003d8ae427f851558c2a3fcd31ae0bb2acbb4ba4904171073a9a1c350c4e1b57151d8074dc1b8f2dd198dc7245793fe47c42ab69349687ea711afa24e1f3b55be4ff00ed3e2b463d8996830e416d83ef9f742365676df990d377375e269b28054a7cdd213056ca6d2b57c9098870e331cf7b180427e2e7068eac2d27b56218e71f9a27b5834acab324cd2f036bb3d52d2e5a49c1a86b8c67fab0c5476bcf4785562edbe584d4cd5ad3cc433e8309be47e28981e14419d2c29504a80c276820aa9e793d745c38d08efb23ba986112a76dff005548d27d5493424550d0e05ae151951039eb31cc37a1d69ab485a76c1ccd3348c10a823210a2c4c89777a3766407121c7014a6f4484a0ce83829441568a7d93b5d40ad4adad11870a3b611e6a9737ad74262c8d685bc69ecd0c2e555deb42e0fa788572072c209eb3223775d779858b8b52570434c5ca9a14f8b067a444b4e0c6811b9b782799886ee4e1d03a0e2bccc2b2ca84d98863ac32c88d451cb3fd4a0160fa7da2d480c3f5356f6d238b9612ccd1f98df25bab40e253f06999b36d01a2669f013222925c2300352792210d5094c82bec4f5a15224a24924a02795409a6bef8d30cdd3aabb1492649208eaf4ab8ed2294f9c944f66379b417bad850914c0ef52cac5c06d6d7b752e2ad9d82624446bdb423368de323c427f27ff0069f7945021d1d5d1ab4549a93bd5bb2d81af70190069baf27e2772153548b93930d84c2f7643893a005888d305ef744766e35a6803405a8e541fb03edb7cd6402be43f46bff1f82334e4cbb0e6da3369ec20a93eb50ceb1bc7c10ec7577a5f3a166a3a6f8b06136cc372bc38d175846820a158a54ddc54a16f88bd30fb5c9121010ef9aa708d10754f61c8fc14a01f125e986ea12c10f64e388c5b8ef5c8b3ae1932a778f35542fede7fa0838ae5ea210e9b8a7d177639a144e8afd0ced2415286478b27b61a7476eb1e2a174c8dbe08636f1ccd3629405743570e3ed96b9fd8b9ce9f90a00bb552835c782f44d7ceb2a461388ad415583959977555a24f146b411b1db52c1ae2b07bab6d686958bb0cf4e17e737f6ada4f695d0c1a6798cfe40888a59751c452c0462c3328afb15094c82bec4f5a1521e92492809e490a23ee92fbb78686e00d6b5ed52427bae02e147532cfa4a28c034dda1c5d4d1aea54d11a4d0034350758a039517162efb6766557d1332ad00d6a337035ee3f1442cc71bce0697834569954e268a90880690adc88a44da5b4af03f14cc4ea42f22e8afcab8cd109adaf49cf040d3400d4f78597011de58305613b4f4876744a0611667f91d2ff001abfd77fd39776a419bd3d7524e90d10c2edc1a82780a08b1e983454f70de5421290028cc5da3c556e6deeeb38ee1805d32cdd22bbeaef150b267cdb4691c4284cf8a8c47118a9604bb73a01d802514570a546ad0a8b2481143868ad68427b9bbf7a1f1251a0de6f4768f0234a960462d3479a6a27aa7b741deaca6890b627ac3b5abad73c674e0558a2e10a12c60889e0a69869b768a884c1a9d0df4237a8e1b94ae83556809f41ab1474e17f30df16ad9cf6958db07ef207e7b7c5ab633da57430f8b3ca72554ebfe82dea5839a85ca79746283328300afb152950af313d68531d4493971404f2388ebee19e25cece980c01ef0936332aec4102a0e34c4663b144fe8baf1f4b0181a0ae38ecc14d01ad6b80a5e2057200508353dddeb8a7609db2edc4e34200c72a63a3b559968c39c1be9b31c3350bba235d07c85c82ea39972952f65e341ac5ef12a47654b43795dd587ed9f0ff000b3e11ee57ba8c87acc4a01acdd3f04120c9970a97b86c6dd007106bf3826e77f91b7819231c5dfec618a0667b333c0285f3669d16e6680bb0a9d8063c689d125dcc7004b5cd71c1f4a383b301c38e2a3891435c09c9ad27e3fb528e9426a4ad1239d740e75e493935b560dc00c78953882001414045699669b2326e71e722605de8e90dd0dae81e6aec56a8115431739b52d13a8a8b18451421b5561c98c508321b34149f001c14d448a84b2acbcb35980141b0903864b91e24469a865f6ec21af1d8703c42b9752b8a1456969964406e9c466d38381d441c4294843ad594f4d9d188060e04b4f109d66fd64b417f36fdb8b1de143dcac07914765d2d56209c14343a411bfe23052c25112524e3d06ec3fbc97fcf1ef356c27563ec3fbd96fcf1ef356c27325d1c3e2cf2bc877305bf3534b289d9a9e595fb161a95c95e62a52d92bac4f5a14c7249d4494251e48c7d5ad3b2877d02ecc476c36dea55c7a2d1a493a3769552d788d86c0d2e0dcdc0d32a018edcc21f67df75223dc4ba94682055add7b095c691d78ab2f3e65cee8d69802e34a5350ef3d8117b2a1068249146fa470ffe20d021b5a7000694f75a5473e1de000c08c3114ad71deae15b654e2f48b9ca788c7321d0b5c445ae041205d757c90e977502965e34271a3684f156c306a0a6497c9d8cc51f82a074e343da5b515391d4e1883c68b3531345af05ed22e906ee142fd1d9a6ab68f9669d01509cb16145a5e15a646a411da102669c795c0ec8c72e68245091966a58a545064dd0c506206bcd3a2b5da8abb3763cb17ec8eabb550972ede507d9210928ef2e5e50125aae55477d2bca1096a9e1401c9e1ca0457b406055f9287468dc86cd3eb41adc3c51696382a660e43242140e87a4607b8ab2a17e6a44c96d6823629fb596fcf1e2d5ae9b88b1365c6a4496fe600ee0b491a3d574b13fc4e4e6f21e4ab12ea931caecb224006e595d86a94b2bac4e42d8f497525651e336c74d85a69a0d346041f254e5cab73501e6a4d28a1810a8571a4a8ebe27689a1b4a867a00738b481d2033dc89426a1f6abba74fc23cd5c51790ecb87c3142d6d3f09f2c15a1301508324f06a6382df54b057faabe4a76b9a33a14235171b1aaa46baaa85f6eb0bbf59034aa2042e84c2c0aa36799eb8e214f0e61bac2ba2589f2cd3980abc4901a090ae5e4af2a0d6492d30599270d3dc98659c8bde0bb40a0d5c99a013e5dfa8a6963c7a27823d742e18614b0beee5fa33ce7b8683c0aeb63a3a6084c74b0d414b0feeff86645e110038b6b5051d977e09ce946ea1c027320d3250464c9f364c0aaf30ea5772982a73a4d30049c32d55571d8893e88aedfa56b469a8a1a63957b91264ec5a75cf686b90982e70cc1e055b8711694da3134984605a719be935dbc11e0adc0e50466e6d638703c6be483f3895f56a6c17046b25f962075a044ded21c88c1e5b4a7a5ce337b560c382ededa78a62cd240bc313d0ffef291ff00da7fa1ff0004979e5e4917d7657d140f9088f25c097500a52a48aee44613554650c47d0505ea6ac4607bd1086173edbd9be09244a1d40a909a84eeb675d2304ad098bad2069c10763369e2894fe204d7c8231a5613de295cbd1739b8d7480b8fb359ade3f5bbcd72cfcf1c5117350ca49f68663e950222c8ea7c41b6a0f88406d4645654738f734ec008e0b62e875519951a8214e869e7d0acf310d6a40d75445965c7878c38dd8ea8f8ad6ba45a740513ecb61f451fcc62943da02cbda5370f08908bc7acc21c7822302de86ec09baef55c0b0f029efb15a7d61fa8f9a645b29c452f5e1a9ed6bc2ab446b1bd3a2f326c1d2a66c7da809b19c3abd03f80b9a3fa4d424d8734cd0d8837dd77c1500e0bd3342232773c81c39f78eb4388dfd351c4542b50679aed2140026232773aa9363029c5ea165ba85dc15131e89cd990a8a2c45340a83e66e1aa922c5aa1d11f528e1b0327885e0cf039d382b2d88c39b5bc10782adc36ad1f2325174c18474537263e4e1e77a836914508075a707394b2a87fd40e870298e9378d47b5384529c239daa5a27641f577eaef092b3f58494e8beca128d271399353daad4589742e426d021f3d1ea68b3ff4d4fa2acd452f3954289b4d2d2375427dc07427b61ea711dfe294dd804b2510070c4ee28a08c84861cfa27b2e94f74cab8b190615e702697a182706b4f134158c0807a736221fcf6d5d130559412e7522f087fd6174465081184dbc68d6971d401278049cd1911423020e041d4b96790d1cf138b0bc81852f35a2e57697b9b41a9ae3a14e224ae97b8e231fb4adc05a034619dd0ed82f0a658dd156572d6a8df2b09dd66b4ef02aadb1f2b9dec7a2727b837eeaf36847489ac5cf0c02e5a1330e20bf7818a5cebc5a1c1aea90ec88180a96d73e8e58e128bb29ff00d2e11ea9737738f8155e349446f55e0ec70a778f82b50e2aec489ad55100d19d18670ebb5ae69f1a2a2665e3fdb89fd251f7450a3bc14a2582a14e179bb88af6952c582594ad31deafd06741555e106c72ec0f40ddf8f82386e85655d59c80e57a1950b6ce232254ad9678da9d4ccd689c2ea87a4330ba22efe0a164abaa311827870544124bb549421c8b92ce4c7de149249968d12d93b14a1249241256aa33f9f6249288b40ed2adc24924c1a8b50d4c924a167548d5c49421d19aebd249420c4d0ba928424819f6ab333a124959454d298735d49510b015491fbc7fb652491e3f2032f8b0f314ad5d496a309139568a924a9868ab11760a4925844a92492843ffd9, 'approved', NULL, '2026-04-06 18:47:14');

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
(5, '505050', 4, 'Meow', 'Whatislove', 'female', '2006-04-01', '2026-04-01', 'Admin', 'Creative', 'Khon Kaen', 'mo.sarasinee@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0894726153', 'https://i.pinimg.com/736x/8f/0d/1d/8f0d1ded2a11628c68891d1f268b5650.jpg'),
(6, '606060', 2, 'Nayeon', 'Im', 'female', '1995-09-22', '2020-01-10', 'Approver', 'IT', 'Bangkok', 'imnayeon@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0811111111', 'https://i.pinimg.com/736x/37/4d/65/374d659f5ac5ede493283cf3f7a43e04.jpg'),
(7, '707070', 2, 'Wonyoung', 'Jang', 'female', '2004-08-31', '2020-02-15', 'Approver', 'Sales', 'Chiang Mai', 'jangwonyoung@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0822222222', 'https://i.pinimg.com/1200x/5d/b4/6e/5db46e4fc276d47db0cf2940c866aa35.jpg'),
(8, '808080', 2, 'Hoseok', 'Jung', 'male', '1994-02-18', '2020-03-20', 'Approver', 'Finance', 'Khon Kaen', 'imurhope@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0833333333', 'https://i.pinimg.com/736x/e6/26/63/e62663463f107dd9cb1c17e44f18d703.jpg'),
(9, '909090', 2, 'Asa', 'Enami', 'female', '2006-04-17', '2020-04-25', 'Approver', 'Creative', 'Chonburi', 'enamiasa@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0844444444', 'https://i.pinimg.com/736x/bc/d7/f0/bcd7f05c5b3e1a0dec4bb1a3d77da181.jpg'),
(10, '101011', 1, 'Jimin', 'Yu', 'female', '2000-04-11', '2022-06-01', 'Sales Coordinator', 'Sales', 'Bangkok', 'katarina@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111111', 'https://i.pinimg.com/736x/8a/a7/df/8aa7df488e02318d04300141a7b67d74.jpg'),
(11, '111111', 1, 'Minjeong', 'Kim', 'female', '2001-01-01', '2022-06-15', 'Customer Experience Analyst', 'Sales', 'Bangkok', 'imwinter@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111112', 'https://i.pinimg.com/1200x/73/73/36/737336e8d1c70104558d68f3e177301c.jpg'),
(12, '121212', 1, 'Aeri', 'Uchinaga', 'female', '1994-03-20', '2022-07-01', 'Content Creator', 'Creative', 'Bangkok', 'aerichandesu@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111113', 'https://i.pinimg.com/736x/79/ee/78/79ee78b5ffae707c7eaa69003caa94f8.jpg'),
(13, '131313', 1, 'Yizhuo', 'Ning', 'other', '2002-10-23', '2022-07-15', 'Payroll Specialist', 'Finance', 'Bangkok', 'imnotningning@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111114', 'https://i.pinimg.com/736x/9a/53/5b/9a535b976efaff03c645547544675bcf.jpg'),
(14, '141414', 1, 'Minji', 'Kim', 'other', '2004-05-07', '2022-08-01', 'Key Account Manager', 'Sales', 'Chiang Mai', 'kimminji@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0901111115', 'https://i.pinimg.com/736x/49/d5/75/49d575becbd7b91cb8da9368a3159b49.jpg'),
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
(31, '313131', 1, 'Julie', 'Han', 'female', '1995-01-10', '2022-06-01', 'Sales Coordinator', 'Sales', 'Khon Kaen', 'juliehan@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0904444441', 'https://i.pinimg.com/1200x/0a/a1/56/0aa1563ba34a413d6bf8b8a4ef309eac.jpg'),
(104, '010101', 1, 'Evangeline', 'Rose', 'female', '2005-09-16', '2026-04-02', 'Content Marketing Executive', 'Sales', 'Khon Kaen', 'Evangeline875@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0955842525', 'https://i.pinimg.com/1200x/e2/f4/09/e2f409f9d3c9c7c4dc190d407f1fe1c1.jpg'),
(105, '020202', 2, 'Sienna', 'Davenport', 'female', '2005-03-22', '2026-03-31', 'Approver', 'Creative', 'Chonburi', 'Sienna832@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0654859722', 'https://i.pinimg.com/736x/d3/c0/30/d3c0309c9803371481123563bad5a99a.jpg'),
(106, '030303', 2, 'Valentin', 'Sinclair', 'male', '2005-01-19', '2026-04-02', 'Approver', 'Finance', 'Khon Kaen', 'Valentin741@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0368794456', 'https://i.pinimg.com/736x/ad/e3/0c/ade30c662d92b862c67a9902384f9e98.jpg'),
(109, '323232', 1, 'Hyewon', 'Shim', 'other', '2004-03-20', '2026-04-06', 'Budgeting & Planning Officer', 'Finance', 'Khon Kaen', 'princessbell@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0812345678', 'https://i.pinimg.com/736x/a1/f8/e9/a1f8e96f6bb7fde4f7e730381032574b.jpg'),
(110, '333333', 1, 'Haneul', 'Won', 'other', '2005-05-25', '2026-04-03', 'Content Creator', 'Creative', 'Khon Kaen', 'bobsky@gmail.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0857486793', 'https://i.pinimg.com/736x/ac/2d/5f/ac2d5f458f05bcf8593d952f193b6c00.jpg'),
(111, '343434', 3, 'Dechawat', 'Pondechapiphat', 'male', '2006-04-18', '2026-04-07', 'Payroll Specialist', 'IT', 'Bangkok', 'copper.cu@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0812345678', 'https://i.pinimg.com/736x/35/38/7c/35387cea6cca6db614f419018c1c79ac.jpg'),
(112, '353535', 3, 'Mark', 'Lee', 'male', '1999-08-02', '2026-04-07', 'Admin', 'Creative', 'Chiang Mai', 'onyourmark@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0878901234', 'https://i.pinimg.com/736x/c2/82/dc/c282dc23b0a49d3a6ec3b9c392788027.jpg'),
(121, '363636', 3, 'Jacqueline', 'Muench', 'other', '1993-10-21', '2026-04-07', 'Admin', 'Creative', 'Phuket', 'jackie@easycheck.com', '$2b$10$PN1/D5XmKbogOZJwhN9YROzcYKS7yytq1GGbdXCCHvOdQaa2szF5a', '0812345678', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPqwLHAYXWU4aPlT5eWFWIwWGBykbLOx49Qw&s');

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

INSERT INTO `User_shifts` (`role_id`, `shift_id`, `user_id`) VALUES
(1, 1, '101010');
=======
INSERT INTO `User_shifts` (`role_id`, `shift_id`, `id`) VALUES
(1, 1, 1),
(1, 1, 2),
(1, 3, 16),
(1, 1, 27);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Events`
--

ALTER TABLE `Events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Event_participants`

ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee` (`id_employee`);

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
ALTER TABLE `Event_participants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`,`id_employee`),
  ADD KEY `id_employee` (`id_employee`);

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
  ADD KEY `id` (`user_id`),
  ADD KEY `shift_id` (`shift_id`),
  ADD KEY `user_id` (`user_id`);
  ADD KEY `id` (`id`),
  ADD KEY `shift_id` (`shift_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--

-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
>>>>>>> a7e11610c57c0e799961f7d9c014c935b2872662

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- Constraints for dumped tables
--

--

-- Constraints for table `Event_participants`
--
ALTER TABLE `Event_participants`
  ADD CONSTRAINT `event_participants_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `Users` (`id_employee`) ON UPDATE CASCADE,
  ADD CONSTRAINT `event_participants_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `Events` (`id`) ON UPDATE CASCADE;

-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `Users` (`id_employee`) ON DELETE CASCADE ON UPDATE CASCADE;

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
