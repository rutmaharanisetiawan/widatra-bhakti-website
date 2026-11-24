-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: localhost    Database: widatra_bhakti
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application_hr_notes`
--

DROP TABLE IF EXISTS `application_hr_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_hr_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` bigint unsigned DEFAULT NULL,
  `author_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `application_hr_notes_application_id_foreign` (`application_id`),
  KEY `application_hr_notes_author_id_foreign` (`author_id`),
  CONSTRAINT `application_hr_notes_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_hr_notes_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_hr_notes`
--

LOCK TABLES `application_hr_notes` WRITE;
/*!40000 ALTER TABLE `application_hr_notes` DISABLE KEYS */;
INSERT INTO `application_hr_notes` VALUES (1,'APP-261120-6337',4,'Sari Ningsih','Kandidat memiliki latar belakang farmasi industri yang sangat kuat.','2026-11-20 08:40:38','2026-11-20 08:40:38');
/*!40000 ALTER TABLE `application_hr_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_status_histories`
--

DROP TABLE IF EXISTS `application_status_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_status_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `happened_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `application_status_histories_application_id_foreign` (`application_id`),
  CONSTRAINT `application_status_histories_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_status_histories`
--

LOCK TABLES `application_status_histories` WRITE;
/*!40000 ALTER TABLE `application_status_histories` DISABLE KEYS */;
INSERT INTO `application_status_histories` VALUES (1,'APP-260728-8387','Submitted',NULL,'2026-07-19 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(2,'APP-260728-8387','Screening',NULL,'2026-07-20 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(3,'APP-260728-8387','Interview','Interview scheduled (Offline) with Sari Ningsih (HR Manager).','2026-07-31 03:00:00','2026-07-28 01:05:03','2026-07-28 01:05:03'),(4,'APP-260728-9224','Submitted',NULL,'2026-07-24 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(5,'APP-260728-9224','Screening',NULL,'2026-07-25 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(6,'APP-260728-4127','Submitted',NULL,'2026-07-27 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(7,'APP-260806-5125','Submitted',NULL,'2026-08-06 06:32:14','2026-08-06 06:32:14','2026-08-06 06:32:14'),(8,'APP-260806-5125','Interview','Interview scheduled (Offline) with test.','2026-08-17 05:00:00','2026-08-06 06:33:36','2026-08-06 06:33:36'),(9,'APP-261120-5949','Submitted',NULL,'2026-11-20 07:03:27','2026-11-20 07:03:27','2026-11-20 07:03:27'),(10,'APP-261120-6337','Submitted',NULL,'2026-11-20 08:40:16',NULL,NULL),(11,'APP-261120-6337','Screening','CV memenuhi kualifikasi awal','2026-11-20 08:40:38',NULL,NULL),(12,'APP-261120-6337','Interview','Interview scheduled (Online) with Dr. Sari & R&D Lead.','2026-11-20 08:41:44',NULL,NULL);
/*!40000 ALTER TABLE `application_status_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `job_slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employment_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `education` json NOT NULL,
  `experience` json NOT NULL,
  `has_no_experience` tinyint(1) NOT NULL DEFAULT '0',
  `skills` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portfolio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cv_original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cv_mime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cv_size` bigint unsigned NOT NULL,
  `cover_letter` longtext COLLATE utf8mb4_unicode_ci,
  `status` enum('Submitted','Screening','Interview','Offer','Hired','Rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Submitted',
  `submitted_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `applications_user_id_job_slug_unique` (`user_id`,`job_slug`),
  KEY `applications_job_slug_foreign` (`job_slug`),
  KEY `applications_status_index` (`status`),
  CONSTRAINT `applications_job_slug_foreign` FOREIGN KEY (`job_slug`) REFERENCES `job_postings` (`slug`) ON DELETE SET NULL,
  CONSTRAINT `applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES ('APP-260728-4127',1,'supply-planner','Supply Chain Planner','Supply Chain','Jakarta HQ','Full-time','Ayu Pratiwi','1998-04-12','Female','ayu.pratiwi@example.com','+62 812 3456 7890','Jl. Merdeka No. 45','Surabaya','[{\"year\": \"2021\", \"major\": \"Pharmacy\", \"degree\": \"S1\", \"institution\": \"Universitas Airlangga\"}]','[{\"role\": \"QC Analyst\", \"period\": \"2021 - 2025\", \"company\": \"PT Kimia Sehat Farma\", \"description\": \"Routine physico-chemical and microbiological testing of injectable products.\"}]',0,'HPLC, UV-Vis, GMP documentation, Microsoft Excel','https://linkedin.com/in/ayupratiwi',NULL,'applications/seed/ayu-pratiwi-cv.pdf','Ayu_Pratiwi_CV.pdf','application/pdf',37,'I am excited to apply my analytical background to support WIDATRA\'s quality mission.','Submitted','2026-07-27 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),('APP-260728-8387',1,'quality-control-analyst','Quality Control Analyst','Quality','Pandaan, East Java','Full-time','Ayu Pratiwi','1998-04-12','Female','ayu.pratiwi@example.com','+62 812 3456 7890','Jl. Merdeka No. 45','Surabaya','[{\"year\": \"2021\", \"major\": \"Pharmacy\", \"degree\": \"S1\", \"institution\": \"Universitas Airlangga\"}]','[{\"role\": \"QC Analyst\", \"period\": \"2021 - 2025\", \"company\": \"PT Kimia Sehat Farma\", \"description\": \"Routine physico-chemical and microbiological testing of injectable products.\"}]',0,'HPLC, UV-Vis, GMP documentation, Microsoft Excel','https://linkedin.com/in/ayupratiwi',NULL,'applications/seed/ayu-pratiwi-cv.pdf','Ayu_Pratiwi_CV.pdf','application/pdf',37,'I am excited to apply my analytical background to support WIDATRA\'s quality mission.','Interview','2026-07-19 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),('APP-260728-9224',1,'ra-officer','Regulatory Affairs Officer','Corporate','Jakarta HQ','Full-time','Ayu Pratiwi','1998-04-12','Female','ayu.pratiwi@example.com','+62 812 3456 7890','Jl. Merdeka No. 45','Surabaya','[{\"year\": \"2021\", \"major\": \"Pharmacy\", \"degree\": \"S1\", \"institution\": \"Universitas Airlangga\"}]','[{\"role\": \"QC Analyst\", \"period\": \"2021 - 2025\", \"company\": \"PT Kimia Sehat Farma\", \"description\": \"Routine physico-chemical and microbiological testing of injectable products.\"}]',0,'HPLC, UV-Vis, GMP documentation, Microsoft Excel','https://linkedin.com/in/ayupratiwi',NULL,'applications/seed/ayu-pratiwi-cv.pdf','Ayu_Pratiwi_CV.pdf','application/pdf',37,'I am excited to apply my analytical background to support WIDATRA\'s quality mission.','Screening','2026-07-24 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),('APP-260806-5125',8,'production-supervisor-sterile','Production Supervisor — Sterile Filling','Production','Pandaan, East Java','Full-time','Gaby','2007-08-01','Female','gaby@gmail.com','12345','test','test','[{\"year\": \"test\", \"major\": \"test\", \"degree\": \"test\", \"institution\": \"test\"}]','[{\"role\": \"test\", \"period\": \"test\", \"company\": \"test\", \"description\": \"test\"}, {\"role\": \"test\", \"period\": \"test\", \"company\": \"test\", \"description\": \"test\"}]',0,'test',NULL,NULL,'applications/8/F5sbyLUvhPNbxiaCPg0Sq32uvjV4G87beuodWtON.pdf','SELARAS_Flowchart_Redesign_PrintReady.pdf','application/pdf',62651,'test','Interview','2026-08-06 06:32:14','2026-08-06 06:32:14','2026-08-06 06:33:36'),('APP-261120-5949',11,'production-supervisor-sterile','Production Supervisor — Sterile Filling','Production','Pandaan, East Java','Full-time','fayadh','2026-11-21','Male','fayadh@gmail.com','123456789','test','test','[{\"year\": \"test\", \"major\": \"test\", \"degree\": \"test\", \"institution\": \"test\"}]','[{\"role\": \"test\", \"period\": \"test\", \"company\": \"test\", \"description\": \"test\"}]',0,'test',NULL,NULL,'applications/11/HmdtUJtPPEFiKh0ZB3fr9XfodzWSaUBnvWSzEEqz.pdf','gemini-svg.pdf','application/pdf',6403,'test','Submitted','2026-11-20 07:03:27','2026-11-20 07:03:27','2026-11-20 07:03:27'),('APP-261120-6337',1,'rd-formulation-scientist','R&D Formulation Scientist','R&D','Pandaan, East Java','Full-time','Ayu Pratiwi','1996-03-20','Perempuan','ayu.pratiwi@example.com','+62 812 3456 7890','Jl. Diponegoro No. 45','Pasuruan','[]','[]',0,'',NULL,NULL,'applications/jQiZcpGZQE5RYfruoIw6PSg5hQgl0yQRPtJ9LbWs.pdf','ayu-cv.pdf','application/pdf',1026980,NULL,'Interview','2026-11-20 08:40:16','2026-11-20 08:40:16','2026-11-20 08:41:44');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cat` enum('Corporate','People','Sustainability','Events') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published_on` date DEFAULT NULL,
  `read` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `gallery` json DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author_role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Published','Draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`slug`),
  KEY `articles_status_cat_index` (`status`,`cat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES ('draft-upcoming-hospital-partnership-summit','Events','July 25, 2026','2026-07-25','2 min read','Upcoming Hospital Partnership Summit 2026','Save the date — our annual Hospital Partnership Summit returns this September in Jakarta.','media:seed-office-building','Details to be finalized before publishing — save the date for our annual Hospital Partnership Summit, returning this September in Jakarta.','[]','[\"Events\"]','Corporate Communications','Events','Draft','2026-07-28 01:05:03','2026-08-06 07:33:48'),('expanding-cold-chain-distribution-to-eastern-indonesia','Corporate','April 10, 2026','2026-04-10','4 min read','Expanding Cold Chain Distribution to Eastern Indonesia','A new distribution hub in Makassar extends reliable access to our sterile products across Sulawesi, Maluku, and Papua.','media:seed-office-building','Our new distribution hub in Makassar significantly shortens delivery times and strengthens cold-chain integrity for hospitals across Sulawesi, Maluku, and Papua — a region historically underserved by centralized Java-based logistics.','[]','[\"Supply Chain\", \"Expansion\"]','Corporate Communications','Corporate','Published','2026-07-28 01:05:03','2026-07-28 01:05:03'),('meet-our-2026-apoteker-trainee-cohort','People','May 22, 2026','2026-05-22','2 min read','Meet Our 2026 Apoteker Trainee Cohort','Twelve newly licensed pharmacists have joined WIDATRA Bhakti through our structured 12-month apoteker development program.','media:seed-team','Twelve newly licensed pharmacists have joined WIDATRA Bhakti through our structured 12-month apoteker development program, rotating across Production, QA, QC, and Regulatory Affairs before settling into a permanent placement.','[\"media:seed-team\"]','[\"Careers\", \"People Development\"]','Human Resources','People','Published','2026-07-28 01:05:03','2026-07-28 01:05:03'),('peresmian-sistem-energi-surya-pabrik-pandaan','Sustainability','May 18, 2026','2026-05-18','4 min','Peresmian Sistem Energi Surya (Solar Energy System) Pabrik Pandaan PT Widatra Bhakti','PT Widatra Bhakti resmi mengoperasikan instalasi Solar Energy System di pabrik Pandaan sebagai komitmen nyata transisi energi hijau ramah lingkungan.','media:seed-factory-aerial','PT Widatra Bhakti secara resmi mengoperasikan instalasi Solar Energy System (Pembangkit Listrik Tenaga Surya / PLTS Atap) di kawasan manufaktur steril Pandaan, Pasuruan. Implementasi energi surya ini merupakan wujud nyata filosofi Otsuka Group dalam menjaga kelestarian lingkungan hidup dan mengurangi emisi karbon secara berkelanjutan.\n\nDengan memanfaatkan intensitas radiasi matahari di wilayah Jawa Timur, sistem panel surya ini memasok kebutuhan energi listrik fasilitas pabrik dan kantor, sekaligus melengkapi inisiatif konservasi air baku lereng Gunung Welirang yang telah dijalankan selama bertahun-tahun.','[]','[\"Solar Energy\", \"Sustainability\", \"Pandaan Plant\", \"Green Manufacturing\"]','Corporate Communications','Sustainability & Environmental Division','Published','2026-11-24 03:08:44','2026-11-24 03:08:44'),('pt-widarta-bhakti-successfully-holds-corporate-innovation-collaboration-day-2026','Corporate','Aug 06, 2026',NULL,'Test','PT Widatra Bhakti Successfully Holds Corporate Innovation & Collaboration Day 2026','Test','media:team-wow0vu','PT Widarta Bhakti successfully organized the Corporate Innovation & Collaboration Day 2026, an internal corporate event aimed at strengthening collaboration, encouraging innovation, and reinforcing the company\'s commitment to continuous improvement within the pharmaceutical industry. The event brought together employees from various departments, management representatives, and strategic partners to share ideas, experiences, and best practices that support the company\'s long-term vision.\n\nThe event began with an opening ceremony led by company management, highlighting the importance of innovation in maintaining competitiveness within the healthcare and pharmaceutical sector. Participants were encouraged to embrace a culture of collaboration, integrity, and continuous learning as fundamental values that drive sustainable business growth.\n\nThroughout the day, attendees participated in a series of engaging sessions, including keynote presentations, panel discussions, product showcases, and interactive workshops. These sessions focused on digital transformation, operational excellence, quality assurance, manufacturing innovation, environmental sustainability, and employee development. Experts from various business units shared practical insights and successful case studies that demonstrated how cross-functional collaboration contributes to improved productivity and service quality.\n\nOne of the event\'s highlights was the Innovation Showcase, where employees presented improvement projects and innovative ideas designed to optimize operational efficiency, enhance product quality, and create added value for customers. The exhibition reflected PT Widarta Bhakti\'s commitment to fostering creativity and empowering employees to contribute actively to organizational development.\n\nIn addition to technical sessions, the event also featured networking activities that encouraged communication and collaboration among employees from different divisions. These activities strengthened teamwork, promoted knowledge sharing, and reinforced the company\'s culture of openness and mutual respect.\n\nCorporate Innovation & Collaboration Day 2026 also served as an opportunity for management to communicate the company\'s strategic direction, upcoming initiatives, and long-term business objectives. Through transparent communication and active employee engagement, PT Widarta Bhakti continues to build a strong organizational culture focused on innovation, operational excellence, and customer satisfaction.\n\nAs part of its commitment to corporate sustainability, several sessions highlighted the company\'s environmental initiatives, responsible manufacturing practices, workplace safety programs, and community engagement efforts. These initiatives demonstrate PT Widarta Bhakti\'s dedication to creating sustainable value for customers, employees, business partners, and society.\n\nThe event concluded with an appreciation ceremony recognizing individuals and teams who made significant contributions to innovation, quality improvement, and operational excellence throughout the year. Management expressed gratitude for the dedication and professionalism demonstrated by all employees and reaffirmed its commitment to supporting continuous growth and development across the organization.\n\nThrough events such as Corporate Innovation & Collaboration Day, PT Widarta Bhakti continues to strengthen its position as a trusted pharmaceutical company by fostering innovation, collaboration, and a culture of excellence. The company remains committed to delivering high-quality healthcare solutions while continuously adapting to industry developments and creating a positive impact for all stakeholders.\n\nWe sincerely thank all participants, speakers, partners, and organizing committee members for their valuable contributions in making this event a success. PT Widarta Bhakti looks forward to hosting more collaborative initiatives that inspire innovation and support the company\'s mission of delivering reliable healthcare solutions for the future.','[\"media:team-wow0vu\"]','[\"Test\"]','Test','Test','Published','2026-08-06 07:03:03','2026-08-06 07:33:39'),('pt-widarta-bhakti-successfully-holds-corporate-innovation-collaboration-day-2026-2','Corporate','Aug 06, 2026',NULL,'test','# PT Widatra Bhakti Successfully Holds Corporate Innovation & Collaboration Day 2026','test','media:team-wow0vu','PT Widarta Bhakti successfully organized the **Corporate Innovation & Collaboration Day 2026**, an internal corporate event aimed at strengthening collaboration, encouraging innovation, and reinforcing the company\'s commitment to continuous improvement within the pharmaceutical industry. The event brought together employees from various departments, management representatives, and strategic partners to share ideas, experiences, and best practices that support the company\'s long-term vision.\n\nThe event began with an opening ceremony led by company management, highlighting the importance of innovation in maintaining competitiveness within the healthcare and pharmaceutical sector. Participants were encouraged to embrace a culture of collaboration, integrity, and continuous learning as fundamental values that drive sustainable business growth.\n\nThroughout the day, attendees participated in a series of engaging sessions, including keynote presentations, panel discussions, product showcases, and interactive workshops. These sessions focused on digital transformation, operational excellence, quality assurance, manufacturing innovation, environmental sustainability, and employee development. Experts from various business units shared practical insights and successful case studies that demonstrated how cross-functional collaboration contributes to improved productivity and service quality.\n\nOne of the event\'s highlights was the Innovation Showcase, where employees presented improvement projects and innovative ideas designed to optimize operational efficiency, enhance product quality, and create added value for customers. The exhibition reflected PT Widarta Bhakti\'s commitment to fostering creativity and empowering employees to contribute actively to organizational development.\n\nIn addition to technical sessions, the event also featured networking activities that encouraged communication and collaboration among employees from different divisions. These activities strengthened teamwork, promoted knowledge sharing, and reinforced the company\'s culture of openness and mutual respect.\n\nCorporate Innovation & Collaboration Day 2026 also served as an opportunity for management to communicate the company\'s strategic direction, upcoming initiatives, and long-term business objectives. Through transparent communication and active employee engagement, PT Widarta Bhakti continues to build a strong organizational culture focused on innovation, operational excellence, and customer satisfaction.\n\nAs part of its commitment to corporate sustainability, several sessions highlighted the company\'s environmental initiatives, responsible manufacturing practices, workplace safety programs, and community engagement efforts. These initiatives demonstrate PT Widarta Bhakti\'s dedication to creating sustainable value for customers, employees, business partners, and society.\n\nThe event concluded with an appreciation ceremony recognizing individuals and teams who made significant contributions to innovation, quality improvement, and operational excellence throughout the year. Management expressed gratitude for the dedication and professionalism demonstrated by all employees and reaffirmed its commitment to supporting continuous growth and development across the organization.\n\nThrough events such as Corporate Innovation & Collaboration Day, PT Widarta Bhakti continues to strengthen its position as a trusted pharmaceutical company by fostering innovation, collaboration, and a culture of excellence. The company remains committed to delivering high-quality healthcare solutions while continuously adapting to industry developments and creating a positive impact for all stakeholders.\n\nWe sincerely thank all participants, speakers, partners, and organizing committee members for their valuable contributions in making this event a success. PT Widarta Bhakti looks forward to hosting more collaborative initiatives that inspire innovation and support the company\'s mission of delivering reliable healthcare solutions for the future.','[\"media:team-wow0vu\"]','[\"test\"]','test','test','Draft','2026-08-06 07:04:13','2026-08-06 07:33:31'),('sustainability-report-2025-highlights','Sustainability','March 02, 2026','2026-03-02','5 min read','Sustainability Report 2025: Highlights','Our 2025 sustainability report highlights a 22% reduction in water usage per unit produced and expanded community health programs.','media:seed-csr-environment','Our 2025 Sustainability Report details a 22% year-on-year reduction in water usage per unit produced, a new solar array covering 15% of plant energy needs, and the expansion of our community health screening program to six additional villages.','[\"media:seed-csr-environment\"]','[\"Sustainability\", \"ESG\"]','Corporate Communications','Sustainability','Published','2026-07-28 01:05:03','2026-07-28 01:05:03'),('test','Events','August 07, 2026','2026-08-07','2 min read','Test','test','media:team-wow0vu','test','[\"media:team-wow0vu\"]','[\"test\"]','gaby@gmail.com','Sports','Published','2026-08-07 09:02:27','2026-08-07 09:03:45'),('turnamen-bulutangkis-antar-divisi-widatra-2026','Events','December 10, 2026','2026-12-10','2 min read','Turnamen Bulutangkis Antar Divisi Widatra 2026','Kompetisi persahabatan bulutangkis tahunan untuk mempererat kekeluargaan karyawan.','media:seed-team','Kegiatan ini diselenggarakan oleh komunitas olahraga Widatra Bhakti dengan kategori ganda putra dan ganda campuran.','[]','[]','Budi Santoso','Widatra Sports Club','Published','2026-11-23 00:25:47','2026-11-23 00:25:47'),('widatra-bhakti-completes-pic-s-gmp-recertification','Corporate','June 18, 2026','2026-06-18','3 min read','WIDATRA Bhakti Completes PIC/S GMP Recertification','Our Pandaan facility has successfully passed its triennial PIC/S GMP recertification audit with zero critical findings.','media:seed-production-line','Our Pandaan manufacturing facility has successfully completed its triennial PIC/S GMP recertification audit, conducted by Indonesia\'s National Agency of Drug and Food Control (BPOM). The audit covered all sterile production lines, quality control laboratories, and warehouse operations, resulting in zero critical findings.\n\nThis recertification reaffirms our unwavering commitment to manufacturing excellence and product safety for the millions of patients who rely on our intravenous and irrigation solutions every year.','[\"media:seed-production-line\", \"media:seed-factory-aerial\"]','[\"GMP\", \"Quality\", \"Certification\"]','Corporate Communications','Corporate','Published','2026-07-28 01:05:03','2026-07-28 01:05:03');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,3,'Andi Wijaya','UPDATE_ROLE','User','1','{\"new_role\":\"External User\"}','127.0.0.1','curl/8.7.1','2026-11-20 06:42:56','2026-11-20 06:42:56'),(2,5,NULL,'LOGIN','User','5',NULL,'::ffff:127.0.0.1','curl/8.7.1',NULL,NULL),(3,8,NULL,'ADMIN_LOGIN','User','8',NULL,'::ffff:127.0.0.1','curl/8.7.1',NULL,NULL),(4,5,NULL,'LOGIN','User','5',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:28:15','2026-11-20 08:28:15'),(5,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:28:55','2026-11-20 08:28:55'),(6,2,NULL,'LOGIN','User','2',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:39:59','2026-11-20 08:39:59'),(7,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:40:16','2026-11-20 08:40:16'),(8,1,'Ayu Pratiwi','submit_application','Application','APP-261120-6337','{\"job_slug\":\"rd-formulation-scientist\",\"job_title\":\"R&D Formulation Scientist\"}','127.0.0.1','curl/8.7.1','2026-11-20 08:40:16','2026-11-20 08:40:16'),(9,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:40:29','2026-11-20 08:40:29'),(10,4,NULL,'LOGIN','User','4',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:40:38','2026-11-20 08:40:38'),(11,4,'Sari Ningsih','update_status','Application','APP-261120-6337','{\"status\":\"Screening\",\"note\":\"CV memenuhi kualifikasi awal\"}','127.0.0.1','curl/8.7.1','2026-11-20 08:40:38','2026-11-20 08:40:38'),(12,4,NULL,'LOGIN','User','4',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:40:44','2026-11-20 08:40:44'),(13,4,NULL,'LOGIN','User','4',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:41:44','2026-11-20 08:41:44'),(14,4,'Sari Ningsih','schedule_interview','Application','APP-261120-6337','{\"date\":\"2026-11-28\",\"time\":\"10:00\",\"type\":\"Online\"}','127.0.0.1','curl/8.7.1','2026-11-20 08:41:44','2026-11-20 08:41:44'),(15,NULL,NULL,'submit_tour_booking','TourBooking','FT-261120-4640','{\"organization\":\"Fakultas Farmasi UNAIR\",\"pax\":40}','127.0.0.1','curl/8.7.1','2026-11-20 08:41:56','2026-11-20 08:41:56'),(16,10,NULL,'LOGIN','User','10',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:41:57','2026-11-20 08:41:57'),(17,10,'Rina Oktaviani','update_status','TourBooking','FT-261120-4640','{\"status\":\"Approved\",\"note\":\"Disetujui untuk sesi pagi kuota 40 orang.\"}','127.0.0.1','curl/8.7.1','2026-11-20 08:41:57','2026-11-20 08:41:57'),(18,2,NULL,'LOGIN','User','2',NULL,'127.0.0.1','curl/8.7.1','2026-11-20 08:42:02','2026-11-20 08:42:02'),(19,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:25:38','2026-11-23 00:25:38'),(20,2,NULL,'LOGIN','User','2',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:25:47','2026-11-23 00:25:47'),(21,2,'Budi Santoso','create_community_event','CommunityEvent','EVT-261123-3330','{\"title\":\"Turnamen Bulutangkis Antar Divisi Widatra 2026\"}','127.0.0.1','curl/8.7.1','2026-11-23 00:25:47','2026-11-23 00:25:47'),(22,9,NULL,'LOGIN','User','9',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:25:47','2026-11-23 00:25:47'),(23,9,'Hendra Setiawan','approve_community_event','CommunityEvent','EVT-261123-3330',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:25:47','2026-11-23 00:25:47'),(24,9,'Hendra Setiawan','publish_community_event','CommunityEvent','EVT-261123-3330','{\"article_slug\":\"turnamen-bulutangkis-antar-divisi-widatra-2026\"}','127.0.0.1','curl/8.7.1','2026-11-23 00:25:47','2026-11-23 00:25:47'),(25,4,NULL,'LOGIN','User','4',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:26:01','2026-11-23 00:26:01'),(26,3,NULL,'LOGIN','User','3',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:26:02','2026-11-23 00:26:02'),(27,3,'Andi Wijaya','UPDATE_ROLE','User','11','{\"new_role\":\"External User\"}','127.0.0.1','curl/8.7.1','2026-11-23 00:26:02','2026-11-23 00:26:02'),(28,3,'Andi Wijaya','UPDATE_STATUS','User','11','{\"new_status\":\"Active\"}','127.0.0.1','curl/8.7.1','2026-11-23 00:26:02','2026-11-23 00:26:02'),(29,3,NULL,'LOGIN','User','3',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:26:08','2026-11-23 00:26:08'),(30,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:31:45','2026-11-23 00:31:45'),(31,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:31:52','2026-11-23 00:31:52'),(32,2,NULL,'LOGIN','User','2',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:31:53','2026-11-23 00:31:53'),(33,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','curl/8.7.1','2026-11-23 00:33:06','2026-11-23 00:33:06'),(34,1,NULL,'LOGIN','User','1',NULL,'127.0.0.1','node','2026-11-23 00:33:21','2026-11-23 00:33:21'),(35,2,NULL,'LOGIN','User','2',NULL,'127.0.0.1','node','2026-11-23 00:33:21','2026-11-23 00:33:21'),(36,4,NULL,'LOGIN','User','4',NULL,'127.0.0.1','node','2026-11-23 00:33:22','2026-11-23 00:33:22'),(37,10,NULL,'LOGIN','User','10',NULL,'127.0.0.1','node','2026-11-23 00:33:22','2026-11-23 00:33:22'),(38,9,NULL,'LOGIN','User','9',NULL,'127.0.0.1','node','2026-11-23 00:33:23','2026-11-23 00:33:23'),(39,5,NULL,'LOGIN','User','5',NULL,'127.0.0.1','node','2026-11-23 00:33:23','2026-11-23 00:33:23'),(40,3,NULL,'LOGIN','User','3',NULL,'127.0.0.1','node','2026-11-23 00:33:23','2026-11-23 00:33:23');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('spatie.permission.cache','a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:30:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:10:\"manage:all\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:9;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:15:\"manage:products\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:9;i:3;i:10;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:15:\"manage:articles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:5:{i:0;i:1;i:1;i:2;i:2;i:9;i:3;i:10;i:4;i:11;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:10:\"manage:csr\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:5:{i:0;i:1;i:1;i:2;i:2;i:9;i:3;i:10;i:4;i:11;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:10:\"manage:cms\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:9;i:3;i:10;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:12:\"manage:media\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:9;i:3;i:10;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:11:\"manage:jobs\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:3;i:2;i:9;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:19:\"manage:applications\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:3;i:2;i:9;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:20:\"manage:tour-bookings\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:5;i:2;i:9;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:25:\"moderate:community-events\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:4;i:2;i:9;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:12:\"manage:users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:9;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:15:\"view:audit-logs\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:9;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:23:\"submit:community-events\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:6;i:2;i:9;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:10:\"apply:jobs\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:7;i:2;i:9;}}i:14;a:4:{s:1:\"a\";i:15;s:1:\"b\";s:17:\"book:factory-tour\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:7;i:2;i:9;}}i:15;a:4:{s:1:\"a\";i:16;s:1:\"b\";s:10:\"manage:all\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:2:{i:0;i:12;i:1;i:20;}}i:16;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:15:\"manage:products\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:4:{i:0;i:12;i:1;i:13;i:2;i:20;i:3;i:21;}}i:17;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:15:\"manage:articles\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:5:{i:0;i:12;i:1;i:13;i:2;i:20;i:3;i:21;i:4;i:22;}}i:18;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:10:\"manage:csr\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:5:{i:0;i:12;i:1;i:13;i:2;i:20;i:3;i:21;i:4;i:22;}}i:19;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:10:\"manage:cms\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:4:{i:0;i:12;i:1;i:13;i:2;i:20;i:3;i:21;}}i:20;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:12:\"manage:media\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:4:{i:0;i:12;i:1;i:13;i:2;i:20;i:3;i:21;}}i:21;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:11:\"manage:jobs\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:3:{i:0;i:12;i:1;i:14;i:2;i:20;}}i:22;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:19:\"manage:applications\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:3:{i:0;i:12;i:1;i:14;i:2;i:20;}}i:23;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:20:\"manage:tour-bookings\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:3:{i:0;i:12;i:1;i:16;i:2;i:20;}}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:25:\"moderate:community-events\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:3:{i:0;i:12;i:1;i:15;i:2;i:20;}}i:25;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:12:\"manage:users\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:2:{i:0;i:12;i:1;i:20;}}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:15:\"view:audit-logs\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:2:{i:0;i:12;i:1;i:20;}}i:27;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:23:\"submit:community-events\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:3:{i:0;i:12;i:1;i:17;i:2;i:20;}}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:10:\"apply:jobs\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:3:{i:0;i:12;i:1;i:18;i:2;i:20;}}i:29;a:4:{s:1:\"a\";i:30;s:1:\"b\";s:17:\"book:factory-tour\";s:1:\"c\";s:7:\"sanctum\";s:1:\"r\";a:3:{i:0;i:12;i:1;i:18;i:2;i:20;}}}s:5:\"roles\";a:20:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:11:\"Super Admin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:9;s:1:\"b\";s:13:\"Administrator\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:13:\"Content Admin\";s:1:\"c\";s:3:\"web\";}i:3;a:3:{s:1:\"a\";i:10;s:1:\"b\";s:14:\"Content Editor\";s:1:\"c\";s:3:\"web\";}i:4;a:3:{s:1:\"a\";i:11;s:1:\"b\";s:15:\"CSR Coordinator\";s:1:\"c\";s:3:\"web\";}i:5;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:10:\"HR Manager\";s:1:\"c\";s:3:\"web\";}i:6;a:3:{s:1:\"a\";i:5;s:1:\"b\";s:18:\"Factory Tour Admin\";s:1:\"c\";s:3:\"web\";}i:7;a:3:{s:1:\"a\";i:4;s:1:\"b\";s:15:\"Event Moderator\";s:1:\"c\";s:3:\"web\";}i:8;a:3:{s:1:\"a\";i:6;s:1:\"b\";s:17:\"Internal Employee\";s:1:\"c\";s:3:\"web\";}i:9;a:3:{s:1:\"a\";i:7;s:1:\"b\";s:13:\"External User\";s:1:\"c\";s:3:\"web\";}i:10;a:3:{s:1:\"a\";i:12;s:1:\"b\";s:11:\"Super Admin\";s:1:\"c\";s:7:\"sanctum\";}i:11;a:3:{s:1:\"a\";i:20;s:1:\"b\";s:13:\"Administrator\";s:1:\"c\";s:7:\"sanctum\";}i:12;a:3:{s:1:\"a\";i:13;s:1:\"b\";s:13:\"Content Admin\";s:1:\"c\";s:7:\"sanctum\";}i:13;a:3:{s:1:\"a\";i:21;s:1:\"b\";s:14:\"Content Editor\";s:1:\"c\";s:7:\"sanctum\";}i:14;a:3:{s:1:\"a\";i:22;s:1:\"b\";s:15:\"CSR Coordinator\";s:1:\"c\";s:7:\"sanctum\";}i:15;a:3:{s:1:\"a\";i:14;s:1:\"b\";s:10:\"HR Manager\";s:1:\"c\";s:7:\"sanctum\";}i:16;a:3:{s:1:\"a\";i:16;s:1:\"b\";s:18:\"Factory Tour Admin\";s:1:\"c\";s:7:\"sanctum\";}i:17;a:3:{s:1:\"a\";i:15;s:1:\"b\";s:15:\"Event Moderator\";s:1:\"c\";s:7:\"sanctum\";}i:18;a:3:{s:1:\"a\";i:17;s:1:\"b\";s:17:\"Internal Employee\";s:1:\"c\";s:7:\"sanctum\";}i:19;a:3:{s:1:\"a\";i:18;s:1:\"b\";s:13:\"External User\";s:1:\"c\";s:7:\"sanctum\";}}}',1795479840);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_event_documents`
--

DROP TABLE IF EXISTS `community_event_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_event_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `community_event_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `community_event_documents_community_event_id_foreign` (`community_event_id`),
  CONSTRAINT `community_event_documents_community_event_id_foreign` FOREIGN KEY (`community_event_id`) REFERENCES `community_events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_event_documents`
--

LOCK TABLES `community_event_documents` WRITE;
/*!40000 ALTER TABLE `community_event_documents` DISABLE KEYS */;
INSERT INTO `community_event_documents` VALUES (1,'EVT-260807-6089','SELARAS_Cross_Functional_Flowchart.pdf','community-events/EVT-260807-6089/nVnwio2OPeqVHbK0eB8XFEeLwQ52C0x4b4IYYiAE.pdf','application/pdf',90676,'2026-08-07 02:30:31','2026-08-07 02:30:31');
/*!40000 ALTER TABLE `community_event_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_event_notes`
--

DROP TABLE IF EXISTS `community_event_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_event_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `community_event_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` bigint unsigned DEFAULT NULL,
  `author_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `community_event_notes_community_event_id_foreign` (`community_event_id`),
  KEY `community_event_notes_author_id_foreign` (`author_id`),
  CONSTRAINT `community_event_notes_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `community_event_notes_community_event_id_foreign` FOREIGN KEY (`community_event_id`) REFERENCES `community_events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_event_notes`
--

LOCK TABLES `community_event_notes` WRITE;
/*!40000 ALTER TABLE `community_event_notes` DISABLE KEYS */;
INSERT INTO `community_event_notes` VALUES (1,'EVT-260807-6089',3,'Andi Wijaya','Published to News & Event.','2026-08-07 09:02:27','2026-08-07 09:02:27'),(2,'EVT-261123-3330',9,'Hendra Setiawan','Published to News & Event.','2026-11-23 00:25:47','2026-11-23 00:25:47');
/*!40000 ALTER TABLE `community_event_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_event_status_histories`
--

DROP TABLE IF EXISTS `community_event_status_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_event_status_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `community_event_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `happened_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `community_event_status_histories_community_event_id_foreign` (`community_event_id`),
  CONSTRAINT `community_event_status_histories_community_event_id_foreign` FOREIGN KEY (`community_event_id`) REFERENCES `community_events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_event_status_histories`
--

LOCK TABLES `community_event_status_histories` WRITE;
/*!40000 ALTER TABLE `community_event_status_histories` DISABLE KEYS */;
INSERT INTO `community_event_status_histories` VALUES (1,'EVT-260807-6089','Draft',NULL,'2026-08-07 02:30:31','2026-08-07 02:30:31','2026-08-07 02:30:31'),(2,'EVT-260807-6089','Pending',NULL,'2026-08-07 02:30:31','2026-08-07 02:30:31','2026-08-07 02:30:31'),(3,'EVT-260807-6089','Approved',NULL,'2026-08-07 09:01:48','2026-08-07 09:01:48','2026-08-07 09:01:48'),(4,'EVT-260807-6089','Published',NULL,'2026-08-07 09:02:27','2026-08-07 09:02:27','2026-08-07 09:02:27'),(5,'EVT-261123-3330','Draft',NULL,'2026-11-23 00:25:47',NULL,NULL),(6,'EVT-261123-3330','Pending',NULL,'2026-11-23 00:25:47',NULL,NULL),(7,'EVT-261123-3330','Approved',NULL,'2026-11-23 00:25:47',NULL,NULL),(8,'EVT-261123-3330','Published',NULL,'2026-11-23 00:25:47',NULL,NULL);
/*!40000 ALTER TABLE `community_event_status_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_events`
--

DROP TABLE IF EXISTS `community_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_events` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `submitter_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submitter_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `community` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` date NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gallery` json DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agreement_accepted` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('Draft','Pending','Revision Requested','Approved','Rejected','Published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `published_article_slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `community_events_published_article_slug_foreign` (`published_article_slug`),
  KEY `community_events_user_id_status_index` (`user_id`,`status`),
  KEY `community_events_status_index` (`status`),
  CONSTRAINT `community_events_published_article_slug_foreign` FOREIGN KEY (`published_article_slug`) REFERENCES `articles` (`slug`) ON DELETE SET NULL,
  CONSTRAINT `community_events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_events`
--

LOCK TABLES `community_events` WRITE;
/*!40000 ALTER TABLE `community_events` DISABLE KEYS */;
INSERT INTO `community_events` VALUES ('EVT-260807-6089',7,'gaby@gmail.com','gaby@widatra.com','Test','Sports','Tournament','2026-08-07','test','test','test','media:team-wow0vu','[\"media:team-wow0vu\"]','[\"test\"]','gaby@gmail.com','test',1,'Published','2026-08-07 02:30:31','test','2026-08-07 02:30:31','2026-08-07 09:02:27'),('EVT-261123-3330',2,'Budi Santoso','budi.santoso@widatra.co.id','Turnamen Bulutangkis Antar Divisi Widatra 2026','Widatra Sports Club','Olahraga','2026-12-10','GOR Pandaan Pasuruan','Kompetisi persahabatan bulutangkis tahunan untuk mempererat kekeluargaan karyawan.','Kegiatan ini diselenggarakan oleh komunitas olahraga Widatra Bhakti dengan kategori ganda putra dan ganda campuran.',NULL,'[]','[]',NULL,NULL,1,'Published','2026-11-23 00:25:47','turnamen-bulutangkis-antar-divisi-widatra-2026','2026-11-23 00:25:47','2026-11-23 00:25:47');
/*!40000 ALTER TABLE `community_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_profile`
--

DROP TABLE IF EXISTS `company_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_profile` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hero_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facility_gallery` json DEFAULT NULL,
  `leadership_photos` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_profile`
--

LOCK TABLES `company_profile` WRITE;
/*!40000 ALTER TABLE `company_profile` DISABLE KEYS */;
INSERT INTO `company_profile` VALUES (1,'media:seed-hero-cleanroom','[\"media:seed-factory-aerial\", \"media:seed-production-line\", \"media:seed-scientist\"]','[\"media:seed-team\"]','2026-07-28 01:05:03','2026-11-19 08:34:08');
/*!40000 ALTER TABLE `company_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_inquiries`
--

DROP TABLE IF EXISTS `contact_inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_inquiries` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Contact Page',
  `received_at` timestamp NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_inquiries_archived_read_index` (`archived`,`read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_inquiries`
--

LOCK TABLES `contact_inquiries` WRITE;
/*!40000 ALTER TABLE `contact_inquiries` DISABLE KEYS */;
INSERT INTO `contact_inquiries` VALUES ('ci-58842dc9-8a39-4d77-a754-13925d07ff8d','Dr. Amelia Tan','RS Mitra Keluarga','amelia.tan@mitrakeluarga.com','+62 815 1122 3344','Product availability inquiry — Ringer Lactate 500ml','We would like to know current stock and MOQ for Ringer Lactate 500ml for our hospital pharmacy procurement.','Contact Page','2026-07-23 01:05:03',1,0,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('ci-9c77a9f3-66dc-46fe-919d-72a4540ffd9c','Nadia Permatasari',NULL,'nadia.permatasari@gmail.com',NULL,'Career opportunities','Hi, I could not find an open QC position matching my background. Do you accept general applications?','Contact Page','2026-07-27 01:05:03',1,0,'2026-07-28 01:05:03','2026-08-06 07:34:23'),('ci-a3d22b89-c2bf-4957-a47c-7210471e7e6d','Ibnu Setiawan','Dinas Kesehatan Kabupaten Pasuruan','ibnu.setiawan@pasuruankab.go.id','+62 817 5566 7788','CSR collaboration — community health program','We would like to explore a joint community health screening program in villages near your Pandaan facility.','Contact Page','2026-07-16 01:05:03',1,1,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('ci-b89ea030-4950-440c-9e4f-d2034f4aa259','Budi Santoso',NULL,'budi@example.com',NULL,'Pertanyaan Pasokan Infus RS','Kami ingin menanyakan katalog pasokan infus Wida NS dan Wida RL.','Contact Page','2026-11-20 08:28:10',0,0,'2026-11-20 08:28:10','2026-11-20 08:28:10'),('ci-fef5b81d-0041-4329-93e0-0f058cd21500','Yusuf Kurniawan','PT Sumber Sehat Distribusi','yusuf.k@sumbersehat.co.id','+62 816 2233 4455','Distributor partnership proposal','We are a distributor covering Kalimantan and would like to discuss a partnership for your IV fluid line.','Contact Page','2026-07-26 01:05:03',1,0,'2026-07-28 01:05:03','2026-07-28 01:05:03');
/*!40000 ALTER TABLE `contact_inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_replies`
--

DROP TABLE IF EXISTS `contact_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_replies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contact_inquiry_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` bigint unsigned DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_replies_contact_inquiry_id_foreign` (`contact_inquiry_id`),
  KEY `contact_replies_author_id_foreign` (`author_id`),
  CONSTRAINT `contact_replies_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `contact_replies_contact_inquiry_id_foreign` FOREIGN KEY (`contact_inquiry_id`) REFERENCES `contact_inquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_replies`
--

LOCK TABLES `contact_replies` WRITE;
/*!40000 ALTER TABLE `contact_replies` DISABLE KEYS */;
INSERT INTO `contact_replies` VALUES (1,'ci-58842dc9-8a39-4d77-a754-13925d07ff8d',NULL,'Thank you for reaching out — our sales team will contact you within 1 business day with current stock and pricing.','2026-07-23 07:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(2,'ci-a3d22b89-c2bf-4957-a47c-7210471e7e6d',NULL,'This sounds like a great fit for our CSR roadmap. Our CSR Coordinator will follow up to schedule a discussion.','2026-07-16 07:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03');
/*!40000 ALTER TABLE `contact_replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `csr_programs`
--

DROP TABLE IF EXISTS `csr_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `csr_programs` (
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pillar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published_on` date DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `gallery` json DEFAULT NULL,
  `impact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Published','Draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`slug`),
  KEY `csr_programs_status_pillar_index` (`status`,`pillar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `csr_programs`
--

LOCK TABLES `csr_programs` WRITE;
/*!40000 ALTER TABLE `csr_programs` DISABLE KEYS */;
INSERT INTO `csr_programs` VALUES ('flood-relief-response-draft','Community Development','Pasuruan Regency','July 20, 2026','2026-07-20','Flood Relief Response — Pasuruan Regency','Draft report on our emergency relief contribution following recent flooding in Pasuruan Regency.','media:seed-csr-community','Report pending final figures — our disaster relief team is coordinating with local authorities on medical supply and volunteer support following the recent flooding in Pasuruan Regency.','[]',NULL,'Draft','2026-07-28 01:05:03','2026-07-28 01:05:03'),('free-health-screening-pandaan-villages','Healthcare','Pandaan, East Java','May 14, 2026','2026-05-14','Free Health Screening for Pandaan Villages','Over 800 residents received free health screenings and consultations near our Pandaan facility.','media:seed-csr-community','In partnership with the local Puskesmas, our CSR team organized a free health screening event reaching over 800 residents across four villages surrounding our Pandaan facility, offering blood pressure, blood sugar, and basic consultations at no cost.','[\"media:seed-csr-community\"]','800+ residents screened','Published','2026-07-28 01:05:03','2026-07-28 01:05:03'),('scholarship-program-pharmacy-students-2026','Education','East Java','January 15, 2026','2026-01-15','Scholarship Program for Pharmacy Students 2026','Ten scholarships awarded to underprivileged pharmacy students across East Java universities.','media:seed-team','This year\'s scholarship cohort supports ten pharmacy students from underprivileged backgrounds across three East Java universities, covering tuition and providing mentorship opportunities within our R&D and QC teams.','[]','10 scholarships awarded','Published','2026-07-28 01:05:03','2026-07-28 01:05:03'),('water-conservation-solar-initiative','Environment','Pandaan Manufacturing Site','February 20, 2026','2026-02-20','Water Conservation & Solar Initiative','Our new rainwater harvesting system and rooftop solar array cut plant water and energy use significantly.','media:seed-csr-environment','A newly commissioned rainwater harvesting system now supplies non-process water needs across the Pandaan site, while a 500kWp rooftop solar array covers roughly 15% of daily plant energy demand — part of our broader push toward operational sustainability.','[\"media:seed-csr-environment\"]','22% reduction in water usage per unit','Published','2026-07-28 01:05:03','2026-07-28 01:05:03');
/*!40000 ALTER TABLE `csr_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `documents_user_id_foreign` (`user_id`),
  CONSTRAINT `documents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factory_tour_content`
--

DROP TABLE IF EXISTS `factory_tour_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factory_tour_content` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hero_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gallery` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factory_tour_content`
--

LOCK TABLES `factory_tour_content` WRITE;
/*!40000 ALTER TABLE `factory_tour_content` DISABLE KEYS */;
INSERT INTO `factory_tour_content` VALUES (1,'media:seed-dark-factory','[\"media:seed-factory-aerial\", \"media:seed-production-line\", \"media:seed-scientist\", \"media:seed-office-building\", \"media:seed-team\", \"media:seed-dark-factory\"]','2026-07-28 01:05:03','2026-07-28 01:05:03');
/*!40000 ALTER TABLE `factory_tour_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `type` enum('Online','Offline') COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_or_link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `interviewer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` enum('Scheduled','Cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Scheduled',
  `scheduled_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `interviews_application_id_unique` (`application_id`),
  CONSTRAINT `interviews_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
INSERT INTO `interviews` VALUES (1,'APP-260728-8387','2026-07-31','10:00:00','Offline','WIDATRA Pandaan Plant — HR Building, Room 2','Sari Ningsih (HR Manager)','Bring original diploma & transcript.','Scheduled','2026-07-21 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(2,'APP-260806-5125','2026-08-17','12:00:00','Offline','test','test','test','Scheduled','2026-08-06 06:33:36','2026-08-06 06:33:36','2026-08-06 06:33:36'),(3,'APP-261120-6337','2026-11-28','10:00:00','Online','https://meet.google.com/abc-defg-hij','Dr. Sari & R&D Lead','Siapkan portofolio riset','Scheduled','2026-11-20 08:41:44','2026-11-20 08:41:44','2026-11-20 08:41:44');
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` enum('Production','Quality','R&D','Engineering','Supply Chain','Corporate','Sales & Marketing') COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `work_mode` enum('On-site','Hybrid','Remote') COLLATE utf8mb4_unicode_ci NOT NULL,
  `employment_type` enum('Full-time','Contract','Internship') COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('Entry','Mid','Senior','Lead') COLLATE utf8mb4_unicode_ci NOT NULL,
  `salary` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deadline` date NOT NULL,
  `posted` date NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `responsibilities` json NOT NULL,
  `qualifications` json NOT NULL,
  `requirements` json NOT NULL,
  `benefits` json NOT NULL,
  `status` enum('Draft','Published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`slug`),
  KEY `job_postings_status_department_index` (`status`,`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_postings`
--

LOCK TABLES `job_postings` WRITE;
/*!40000 ALTER TABLE `job_postings` DISABLE KEYS */;
INSERT INTO `job_postings` VALUES ('internship-qc','Internship — Quality Control Laboratory','Quality','Pandaan, East Java','On-site','Internship','Entry',NULL,'2026-06-30','2026-05-01','6-month internship program in our QC lab for final-year pharmacy and chemistry students.','Get hands-on experience in a real pharmaceutical QC environment under senior analyst mentorship.','[\"Shadow QC analysts on routine testing\", \"Support documentation and trend reporting\", \"Complete a final intern project\"]','[\"Final-semester S1 student in Pharmacy / Chemistry / Biology\"]','[\"Recommendation letter from university\", \"Available 6 months on-site\"]','[\"Monthly stipend\", \"Dormitory option\", \"Certificate & potential conversion to full-time\"]','Draft',0,'media:seed-scientist','2026-07-28 01:05:03','2026-07-28 01:05:03'),('maintenance-engineer','Maintenance Engineer — Utilities & WFI','Engineering','Pandaan, East Java','On-site','Full-time','Mid',NULL,'2026-08-30','2026-06-10','Keep our Water-for-Injection, clean steam and HVAC systems running at pharmaceutical-grade reliability.','Own preventive and predictive maintenance for critical utilities supporting our parenteral lines.','[\"Execute PM schedules for WFI, clean steam, HVAC, compressed air\", \"Lead utility qualification (IQ/OQ/PQ) revalidation\", \"Troubleshoot deviations and lead root-cause analysis\"]','[\"S1 Mechanical / Electrical Engineering\", \"3+ years in pharma utilities\"]','[\"Working knowledge of GAMP 5 and PIC/S Annex 1\", \"Available on-call for utility incidents\"]','[\"Standby allowance\", \"BPJS + family insurance\", \"Annual technical training abroad\"]','Published',0,'media:seed-factory-aerial','2026-07-28 01:05:03','2026-07-28 01:05:03'),('production-supervisor-sterile','Production Supervisor — Sterile Filling','Production','Pandaan, East Java','On-site','Full-time','Mid',NULL,'2026-08-31','2026-06-15','Lead a shift on our Grade A closed-system filling lines, ensuring every batch meets PIC/S GMP standards.','You will manage daily filling operations for large-volume parenterals, supervise a team of 12 operators, and partner with QA to deliver sterile product with zero deviation.','[\"Supervise sterile filling line per batch record and SOP\", \"Coordinate with QA, QC and Engineering on line clearance and changeover\", \"Conduct shift handover, deviation investigation, and CAPA execution\", \"Train operators on aseptic technique and gowning qualification\", \"Drive line OEE, yield, and right-first-time KPIs\"]','[\"S1 in Pharmacy, Pharmaceutical Engineering or related\", \"Minimum 4 years in sterile manufacturing\", \"Apoteker license preferred\"]','[\"Hands-on knowledge of cGMP, PIC/S, and Annex 1\", \"Experience with deviation, change control, and risk assessment tools\", \"Willing to work in rotating shift system\"]','[\"Competitive base + shift allowance\", \"BPJS Kesehatan & Ketenagakerjaan\", \"Annual performance bonus\", \"Health & dental coverage for family\", \"Continuous GMP training\"]','Published',1,'media:seed-production-line','2026-07-28 01:05:03','2026-07-28 01:05:03'),('quality-control-analyst','Quality Control Analyst','Quality','Pandaan, East Java','On-site','Full-time','Entry',NULL,'2026-07-30','2026-05-20','Run physico-chemical and microbiological testing of raw materials, in-process and finished products.','Join a 30-person QC team operating a fully equipped analytical and microbiology lab supporting our parenteral portfolio.','[\"Perform HPLC, UV-Vis, titration, pH, osmolality testing\", \"Conduct bioburden, endotoxin (LAL), and sterility testing\", \"Document results per ALCOA+ data-integrity principles\", \"Maintain instrument calibration and qualification\"]','[\"S1 Pharmacy / Chemistry / Biology\", \"Fresh graduates encouraged\"]','[\"Strong attention to detail\", \"English communication (read & write)\", \"Willing to relocate to Pandaan\"]','[\"BPJS Kesehatan & Ketenagakerjaan\", \"Meal & transport allowance\", \"Career path into Senior Analyst / Supervisor\", \"Internal apoteker certification support\"]','Published',0,'media:seed-scientist','2026-07-28 01:05:03','2026-07-28 01:05:03'),('ra-officer','Regulatory Affairs Officer','Corporate','Jakarta HQ','Hybrid','Full-time','Mid',NULL,'2026-08-15','2026-06-01','Manage product registrations, variations, and renewals with BPOM and ASEAN regulators.','Own the full life-cycle dossier for assigned products and serve as our trusted liaison with regulatory bodies across the region.','[\"Compile CTD dossiers for new registrations and variations\", \"Track regulatory timelines and ensure on-time submissions\", \"Liaise with BPOM and ASEAN NRAs\", \"Monitor regulatory intelligence and impact on portfolio\"]','[\"Apoteker with 3+ years RA experience\", \"Familiar with ASEAN ACTD/ACTR\"]','[\"Excellent English written communication\", \"Strong dossier and project skills\"]','[\"Hybrid Jakarta arrangement\", \"International training opportunity\", \"Performance bonus\"]','Published',0,'media:seed-office-building','2026-07-28 01:05:03','2026-07-28 01:05:03'),('rd-formulation-scientist','R&D Formulation Scientist','R&D','Pandaan, East Java','On-site','Full-time','Senior',NULL,'2026-09-30','2026-06-05','Develop next-generation sterile formulations and packaging systems for our Indonesian and export markets.','Lead bench-to-pilot formulation development with cross-functional support from QA, RA, and Engineering.','[\"Design and execute formulation experiments (DoE)\", \"Develop stability protocols and interpret data\", \"Author development reports and tech transfer dossiers\", \"Lead pilot-scale trials and scale-up to commercial\"]','[\"S2 Pharmaceutics or Pharmaceutical Technology preferred\", \"5+ years in sterile R&D\"]','[\"Strong analytical & statistical skills\", \"Experience with terminal sterilization\"]','[\"Senior-band compensation\", \"Patent royalty program\", \"International conference budget\"]','Published',1,'media:seed-scientist','2026-07-28 01:05:03','2026-07-28 01:05:03'),('sales-representative-east','Hospital Sales Representative — East Indonesia','Sales & Marketing','Jakarta HQ','On-site','Full-time','Mid',NULL,'2026-09-15','2026-06-12','Represent the WIDATRA portfolio across hospitals in Sulawesi, Maluku, and Papua.','Build long-term clinical partnerships with hospital pharmacies and procurement teams.','[\"Achieve regional sales target\", \"Manage distributor relationships\", \"Lead clinical detailing with HCPs\"]','[\"S1 any field, Pharmacy preferred\", \"3+ years pharmaceutical sales\"]','[\"Willing to travel 60% of time\", \"Strong network in target region\"]','[\"Sales incentive scheme\", \"Company car allowance\", \"BPJS + private health\"]','Published',0,'media:seed-team','2026-07-28 01:05:03','2026-07-28 01:05:03'),('supply-planner','Supply Chain Planner','Supply Chain','Jakarta HQ','Hybrid','Full-time','Mid',NULL,'2026-07-31','2026-06-01','Balance demand, production capacity, and inventory across our hospital and distributor channels.','Drive S&OP cycle and ensure 98%+ service level for critical infusion products.','[\"Run monthly S&OP with Sales, Production, Finance\", \"Maintain MPS and MRP accuracy in ERP\", \"Manage finished-goods inventory KPI\"]','[\"S1 Industrial Engineering / Business\", \"APICS / CPIM preferred\"]','[\"SAP MM/PP experience\", \"Strong Excel & analytical skills\"]','[\"Hybrid work\", \"Performance bonus\", \"Training subsidy\"]','Published',0,'media:seed-office-building','2026-07-28 01:05:03','2026-07-28 01:05:03');
/*!40000 ALTER TABLE `job_postings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_assets`
--

DROP TABLE IF EXISTS `media_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_assets` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `folder` enum('Products','News & Event','CSR','Factory Tour','Company Profile','Gallery','Others') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `media_assets_folder_index` (`folder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_assets`
--

LOCK TABLES `media_assets` WRITE;
/*!40000 ALTER TABLE `media_assets` DISABLE KEYS */;
INSERT INTO `media_assets` VALUES ('seed-csr-community','CSR Community.jpg','seed/csr-community.jpg','CSR','image/jpeg',176000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-csr-environment','CSR Environment.jpg','seed/csr-environment.jpg','CSR','image/jpeg',164000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-dark-factory','Dark Factory.jpg','seed/dark-factory.jpg','Factory Tour','image/jpeg',198000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-factory-aerial','Factory Aerial.jpg','seed/factory-aerial.jpg','Factory Tour','image/jpeg',224000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-hero-cleanroom','Hero Cleanroom.jpg','seed/hero-cleanroom.jpg','Gallery','image/jpeg',236000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-iv-bag','IV Bag - Bottle.jpg','seed/iv-bag.jpg','Products','image/jpeg',148000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-office-building','Office Building.jpg','seed/office-building.jpg','Company Profile','image/jpeg',210000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-production-line','Production Line.jpg','seed/production-line.jpg','Factory Tour','image/jpeg',204000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-scientist','Scientist - Lab.jpg','seed/scientist.jpg','News & Event','image/jpeg',188000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-supplies','Medical Supplies - Device.jpg','seed/supplies.jpg','Products','image/jpeg',132000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-team','Team.jpg','seed/team.jpg','Company Profile','image/jpeg',192000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('seed-vial','Vial.jpg','seed/vial.jpg','Products','image/jpeg',96000,'2026-07-28 01:05:03','2026-07-28 01:05:03'),('supplies-vjo3dd','supplies.jpg','media/Snf2a4jE2nxuPuAREnVJzTahA3PepO1bvyZ0yCOy.jpg','Others','image/jpeg',29168,'2026-08-06 07:20:45','2026-08-06 07:20:45'),('team-wow0vu','team.jpg','media/K4ScMCCIpKgvkknoiY1PjPNzPn92s6hj2RptjlG0.jpg','News & Event','image/jpeg',169077,'2026-08-06 07:01:40','2026-08-06 07:01:40'),('vial-evh5ld','vial.jpg','media/ewDyIzaYCzhzoQCUT9jCXCBYrVUX3NBcTVIBIR5d.jpg','Others','image/jpeg',37333,'2026-08-06 07:20:36','2026-08-06 07:20:36');
/*!40000 ALTER TABLE `media_assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2026_01_01_000001_create_users_table',1),(2,'2026_01_01_000002_create_password_reset_tokens_table',1),(3,'2026_01_01_000003_create_sessions_table',1),(4,'2026_01_01_000004_create_cache_table',1),(5,'2026_01_01_000005_create_queue_jobs_table',1),(6,'2026_01_01_000006_create_personal_access_tokens_table',1),(7,'2026_01_01_000007_create_media_assets_table',1),(8,'2026_01_01_000008_create_job_postings_table',1),(9,'2026_01_01_000009_create_applications_table',1),(10,'2026_01_01_000010_create_application_status_histories_table',1),(11,'2026_01_01_000011_create_application_hr_notes_table',1),(12,'2026_01_01_000012_create_interviews_table',1),(13,'2026_01_01_000013_create_tour_bookings_table',1),(14,'2026_01_01_000014_create_tour_status_histories_table',1),(15,'2026_01_01_000015_create_tour_notes_table',1),(16,'2026_01_01_000016_create_articles_table',1),(17,'2026_01_01_000017_create_products_table',1),(18,'2026_01_01_000018_create_csr_programs_table',1),(19,'2026_01_01_000019_create_community_events_table',1),(20,'2026_01_01_000020_create_community_event_documents_table',1),(21,'2026_01_01_000021_create_community_event_status_histories_table',1),(22,'2026_01_01_000022_create_community_event_notes_table',1),(23,'2026_01_01_000023_create_contact_inquiries_table',1),(24,'2026_01_01_000024_create_contact_replies_table',1),(25,'2026_01_01_000025_create_company_profile_table',1),(26,'2026_01_01_000026_create_factory_tour_content_table',1),(27,'2026_01_01_000027_create_documents_table',1),(28,'2026_01_01_000028_create_notifications_table',1),(29,'2026_11_20_133544_create_permission_tables',2),(30,'2026_11_20_133548_create_audit_logs_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (18,'App\\Models\\User',1),(6,'App\\Models\\User',2),(17,'App\\Models\\User',2),(12,'App\\Models\\User',3),(20,'App\\Models\\User',3),(14,'App\\Models\\User',4),(13,'App\\Models\\User',5),(21,'App\\Models\\User',5),(2,'App\\Models\\User',6),(11,'App\\Models\\User',6),(13,'App\\Models\\User',6),(22,'App\\Models\\User',6),(12,'App\\Models\\User',7),(20,'App\\Models\\User',7),(12,'App\\Models\\User',8),(20,'App\\Models\\User',8),(15,'App\\Models\\User',9),(16,'App\\Models\\User',10),(7,'App\\Models\\User',11),(18,'App\\Models\\User',11);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tone` enum('info','success','warning','danger') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_read_at_index` (`user_id`,`read_at`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,8,'Application received — Production Supervisor — Sterile Filling','We have received your application and it is now under review.','success','/applicant/applications',NULL,'2026-08-06 06:32:14','2026-08-06 06:32:14'),(2,8,'Interview scheduled — Production Supervisor — Sterile Filling','Your interview is scheduled for 2026-08-17 12:00.','info','/applicant/applications',NULL,'2026-08-06 06:33:36','2026-08-06 06:33:36'),(3,7,'Event approved — Test','Your community event submission has been approved.','success','/applicant/events',NULL,'2026-08-07 09:01:48','2026-08-07 09:01:48'),(4,7,'Event published — Test','Your community event is now live on News & Event.','success','/news/test',NULL,'2026-08-07 09:02:27','2026-08-07 09:02:27'),(5,11,'Application received — Production Supervisor — Sterile Filling','We have received your application and it is now under review.','success','/applicant/applications',NULL,'2026-11-20 07:03:27','2026-11-20 07:03:27'),(6,1,'Application received — R&D Formulation Scientist','We have received your application and it is now under review.','success','/applicant/applications','2026-11-22 17:31:53','2026-11-20 08:40:16','2026-11-22 17:31:53'),(7,1,'Application update — R&D Formulation Scientist','Your application status changed to \"Screening\".','info','/applicant/applications','2026-11-22 17:31:53','2026-11-20 08:40:38','2026-11-22 17:31:53'),(8,1,'Interview scheduled — R&D Formulation Scientist','Your interview is scheduled for 2026-11-28 10:00.','info','/applicant/applications','2026-11-22 17:31:53','2026-11-20 08:41:44','2026-11-22 17:31:53'),(9,2,'Event approved — Turnamen Bulutangkis Antar Divisi Widatra 2026','Your community event submission has been approved.','success','/applicant/events',NULL,'2026-11-23 00:25:47','2026-11-23 00:25:47'),(10,2,'Event published — Turnamen Bulutangkis Antar Divisi Widatra 2026','Your community event is now live on News & Event.','success','/news/turnamen-bulutangkis-antar-divisi-widatra-2026',NULL,'2026-11-23 00:25:47','2026-11-23 00:25:47');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'manage:all','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(2,'manage:products','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(3,'manage:articles','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(4,'manage:csr','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(5,'manage:cms','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(6,'manage:media','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(7,'manage:jobs','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(8,'manage:applications','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(9,'manage:tour-bookings','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(10,'moderate:community-events','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(11,'manage:users','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(12,'view:audit-logs','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(13,'submit:community-events','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(14,'apply:jobs','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(15,'book:factory-tour','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(16,'manage:all','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(17,'manage:products','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(18,'manage:articles','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(19,'manage:csr','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(20,'manage:cms','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(21,'manage:media','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(22,'manage:jobs','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(23,'manage:applications','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(24,'manage:tour-bookings','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(25,'moderate:community-events','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(26,'manage:users','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(27,'view:audit-logs','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(28,'submit:community-events','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(29,'apply:jobs','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(30,'book:factory-tour','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (30,'App\\Models\\User',3,'admin-console','11a2b84d507e4c966665dd02297237bfc90f5df93c4e4896782a6f2a062bea0f','[\"*\"]','2026-11-19 08:34:08',NULL,'2026-11-19 08:33:49','2026-11-19 08:34:08'),(31,'App\\Models\\User',3,'admin-console','44e1a0cf847bfd8b07eea7be86e73c5e0cdc6ff0f8c91d91d7f97f80edd5241a','[\"*\"]',NULL,NULL,'2026-11-19 08:33:54','2026-11-19 08:33:54'),(32,'App\\Models\\User',7,'admin-console','d0e2ead13eaab24decf67b2076300a976a61ae34b911402b40e616c8e07ebcfd','[\"*\"]',NULL,NULL,'2026-11-19 08:33:59','2026-11-19 08:33:59'),(33,'App\\Models\\User',8,'admin-console','1498cd20f973e5b17f642b024c3f17ffa4dbead2d7f3780e254b0d2a2dfb1a85','[\"*\"]',NULL,NULL,'2026-11-19 08:34:03','2026-11-19 08:34:03'),(34,'App\\Models\\User',3,'admin-console','d56360e828656ac6177c17cfec7c810238d0ba23700b6a2639be07f1ecf22dbd','[\"*\"]','2026-11-20 02:04:38',NULL,'2026-11-19 08:34:43','2026-11-20 02:04:38'),(39,'App\\Models\\User',3,'admin-console','e2bda4583cbdf9ff91571a7c81f89afabb3561cdf48a4b2c4d1965762abab719','[\"*\"]','2026-11-20 06:42:56',NULL,'2026-11-20 06:41:58','2026-11-20 06:42:56'),(40,'App\\Models\\User',1,'applicant','9554e6f70dc5689bb268d64d4a996db17bea8225f101a6a2ef0ca17ded17037a','[\"*\"]','2026-11-20 06:43:17',NULL,'2026-11-20 06:43:04','2026-11-20 06:43:17'),(41,'App\\Models\\User',2,'applicant','3a7d97d0cdc0b387fe69ddc696ca9a41c7c0610cec6324cc9d325f6d9ac45e20','[\"*\"]','2026-11-20 06:44:03',NULL,'2026-11-20 06:43:25','2026-11-20 06:44:03'),(43,'App\\Models\\User',9,'admin-console','e7562b37caf039f714ec7409e67b0bd0ef367a918f2fe1535e33a1b64cdc05b8','[\"*\"]',NULL,NULL,'2026-11-20 07:01:28','2026-11-20 07:01:28'),(44,'App\\Models\\User',10,'admin-console','80679abdcc5e2d0f519b8327aa2d3b77d21f475b37723bf9e685922da428f38f','[\"*\"]',NULL,NULL,'2026-11-20 07:01:28','2026-11-20 07:01:28'),(45,'App\\Models\\User',8,'admin-console','f87ca48c80c7fce6f405dcd17d83b94f4ee0f9fd6aab42ae4708570646a7c1d6','[\"*\"]',NULL,NULL,'2026-11-20 07:01:34','2026-11-20 07:01:34'),(53,'App\\Models\\User',5,'admin-console','89d281311f04787c737b48f01299bd062b3b33f62e5d54f78eef00080462666b','[\"*\"]','2026-11-23 00:32:19',NULL,'2026-11-20 07:15:45','2026-11-23 00:32:19'),(54,'App\\Models\\User',5,'admin-console','41f0399d53294a6a1acafdccb56d5f5f501920fd2b3380450bad047e30aa2bf5','[\"*\"]','2026-11-20 07:16:48',NULL,'2026-11-20 07:16:48','2026-11-20 07:16:48'),(55,'App\\Models\\User',5,'applicant','88771ffa618d9060da4247971c62a85f89b83380e58a4e28fd3eda4652cf6b47','[\"*\"]',NULL,NULL,'2026-11-20 08:08:45','2026-11-20 08:08:45'),(56,'App\\Models\\User',3,'admin-console','ecc766bc67867d970114015ae1dc4c6fd1dbda90b2fb465cd35b6318a2fd4368','[\"*\"]','2026-11-23 00:24:00',NULL,'2026-11-23 00:24:00','2026-11-23 00:24:00'),(57,'App\\Models\\User',3,'admin-console','b266564b74743969003687802bb9f7d3c0917a66d5973b0627b909569b256fa6','[\"*\"]','2026-11-23 00:24:15',NULL,'2026-11-23 00:24:15','2026-11-23 00:24:15');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('Basic Intravenous','Specialty Solution','Irrigation','Medical Device') COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` enum('Generic','Branded') COLLATE utf8mb4_unicode_ci NOT NULL,
  `osmolarity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calorie` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nie` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `packaging` json NOT NULL,
  `sizes` json NOT NULL,
  `indication` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `benefits` json NOT NULL,
  `applications` json NOT NULL,
  `storage` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shelf_life` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `composition` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `manufacturing_note` text COLLATE utf8mb4_unicode_ci,
  `img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `products_category_index` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('ADMIN-SET-01','IV Administration Set','Medical Device','Branded',NULL,NULL,'AKD 20301234567','[\"Individual sterile pouch\"]','[\"Standard 150cm\"]','Delivery of IV fluids and medications from container to patient.','[\"DEHP-free tubing available\", \"Precision roller clamp for flow control\"]','[\"Hospital ward infusion therapy\", \"Emergency & ICU use\"]','Store in a cool, dry place.','60 months from date of manufacture','Medical-grade PVC tubing, drip chamber, roller clamp, injection site.','ETO sterilized and validated per ISO 11135.','media:vial-evh5ld','Reliable delivery, every drop.','2026-07-28 01:05:03','2026-08-06 07:21:33'),('D5-500','Dextrose 5% Infusion','Specialty Solution','Generic','253 mOsm/L','170 kcal/L','-','[\"Soft Bag\", \"Bottle\"]','[\"250 mL\", \"500 mL\"]','Caloric supplementation and free-water replacement.','[\"Provides readily available energy source\", \"Vehicle for IV medication\"]','[\"Hypoglycemia management\", \"Fluid maintenance therapy\"]','Store below 30°C.','24 months from date of manufacture','Each 100 mL contains Dextrose Anhydrous 5 g in Water for Injection.',NULL,'media:supplies-vjo3dd','Gentle energy support.','2026-07-28 01:05:03','2026-08-06 07:21:21'),('IRR-3000','Sterile Water for Irrigation','Irrigation','Generic','0 mOsm/L','0 kcal/L','-','[\"Bottle\"]','[\"1000 mL\", \"3000 mL\"]','Surgical and wound irrigation — not for injection.','[\"Non-pyrogenic, sterile\", \"Wide-mouth bottle for surgical convenience\"]','[\"Urological irrigation\", \"General surgical field irrigation\"]','Store below 30°C.','36 months from date of manufacture','Water for Injection.',NULL,'media:supplies-vjo3dd','Purity built for the operating room.','2026-07-28 01:05:03','2026-08-06 07:22:07'),('NACL-0-9-500','Sodium Chloride 0.9% Infusion','Basic Intravenous','Generic','308 mOsm/L','0 kcal/L','-','[\"Soft Bag\", \"Bottle\"]','[\"100 mL\", \"250 mL\", \"500 mL\", \"1000 mL\"]','Extracellular fluid replacement, vehicle for compatible drug administration, and wound irrigation.','[\"Isotonic — well tolerated\", \"Compatible with most IV medications\", \"Sterile, pyrogen-free\"]','[\"Hydration therapy\", \"Electrolyte replacement\", \"Drug diluent\"]','Store below 30°C, protect from freezing.','24 months from date of manufacture','Each 100 mL contains Sodium Chloride 0.9 g in Water for Injection.','Manufactured in a Grade A closed-system filling line under PIC/S GMP.','media:vial-evh5ld','The everyday standard for fluid therapy.','2026-07-28 01:05:03','2026-08-06 07:22:00'),('RL-500','Ringer\'s Lactate Infusion','Basic Intravenous','Generic','273 mOsm/L','9 kcal/L','-','[\"Soft Bag\"]','[\"500 mL\", \"1000 mL\"]','Replacement of extracellular fluid and electrolyte losses, mild metabolic acidosis correction.','[\"Closest electrolyte profile to plasma\", \"Supports acid-base balance\"]','[\"Surgical fluid replacement\", \"Trauma & burns resuscitation\"]','Store below 30°C, protect from freezing.','24 months from date of manufacture','Sodium Chloride, Sodium Lactate, Potassium Chloride, Calcium Chloride in Water for Injection.',NULL,'media:supplies-vjo3dd','Balanced electrolytes for critical care.','2026-07-28 01:05:03','2026-08-06 07:21:41');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(2,2),(3,2),(4,2),(5,2),(6,2),(7,3),(8,3),(10,4),(9,5),(13,6),(14,7),(15,7),(1,9),(2,9),(3,9),(4,9),(5,9),(6,9),(7,9),(8,9),(9,9),(10,9),(11,9),(12,9),(13,9),(14,9),(15,9),(2,10),(3,10),(4,10),(5,10),(6,10),(3,11),(4,11),(16,12),(17,12),(18,12),(19,12),(20,12),(21,12),(22,12),(23,12),(24,12),(25,12),(26,12),(27,12),(28,12),(29,12),(30,12),(17,13),(18,13),(19,13),(20,13),(21,13),(22,14),(23,14),(25,15),(24,16),(28,17),(29,18),(30,18),(16,20),(17,20),(18,20),(19,20),(20,20),(21,20),(22,20),(23,20),(24,20),(25,20),(26,20),(27,20),(28,20),(29,20),(30,20),(17,21),(18,21),(19,21),(20,21),(21,21),(18,22),(19,22);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Admin','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(2,'Content Admin','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(3,'HR Manager','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(4,'Event Moderator','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(5,'Factory Tour Admin','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(6,'Internal Employee','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(7,'External User','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(8,'Guest / Visitor','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(9,'Administrator','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(10,'Content Editor','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(11,'CSR Coordinator','web','2026-11-20 06:36:55','2026-11-20 06:36:55'),(12,'Super Admin','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(13,'Content Admin','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(14,'HR Manager','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(15,'Event Moderator','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(16,'Factory Tour Admin','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(17,'Internal Employee','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(18,'External User','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(19,'Guest / Visitor','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(20,'Administrator','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(21,'Content Editor','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48'),(22,'CSR Coordinator','sanctum','2026-11-20 06:42:48','2026-11-20 06:42:48');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('i6Igq3umYrIC2jb4u9Nw6FQt2jET4p2Xn19VBdnc',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15','YTozOntzOjY6Il90b2tlbiI7czo0MDoibUJwWWJvTGRVR213WlEycnBxcVVoQW1SeW9lTjVRTU5pdFZJeVhuTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1786693471),('iAUrTx4x14XzjZZq64EFrorT6j1lj4Hswg8kVtW5',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlZOYzF5akNQTVFLVFFieEtwdGdmQlUxcFgzaEQ2d3dlUVhjMEpmNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1786000342),('jjiJ9lT8nm3ia9MunecZWXr2CFUEIsRPGE45Hakx',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzR3c011TE5xbzVsSEllOWI1THBzSkFDS2liUW95YVc3SjNqaGRuTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1786345394);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_bookings`
--

DROP TABLE IF EXISTS `tour_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_bookings` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `tour_date` date NOT NULL,
  `time_slot` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visitor_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pax` int unsigned NOT NULL,
  `purpose` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Pending','Reviewed','Approved','Rejected','Completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `submitted_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tour_bookings_user_id_foreign` (`user_id`),
  KEY `tour_bookings_email_id_index` (`email`,`id`),
  KEY `tour_bookings_status_index` (`status`),
  CONSTRAINT `tour_bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_bookings`
--

LOCK TABLES `tour_bookings` WRITE;
/*!40000 ALTER TABLE `tour_bookings` DISABLE KEYS */;
INSERT INTO `tour_bookings` VALUES ('FT-260728-3680',NULL,'2026-07-08','09:00 - 11:00','Fajar Nugroho','PT Distribusi Farma Nusantara','fajar.nugroho@dfn.co.id','+62 813 5566 7788',4,'Distributor partner facility audit and relationship visit.','Completed','2026-06-30 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),('FT-260728-3929',NULL,'2026-08-12','13:00 - 15:00','Maya Kusuma','SMK Farmasi Harapan Bangsa','maya.kusuma@smkfarmasi.sch.id','+62 814 6677 8899',30,'Vocational school factory exposure program.','Rejected','2026-07-25 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),('FT-260728-5270',NULL,'2026-08-15','13:00 - 15:00','Prof. Retno Wulandari','Universitas Airlangga — Faculty of Pharmacy','retno.wulandari@unair.ac.id','+62 812 3344 5566',25,'Undergraduate industrial pharmacy field trip.','Pending','2026-07-26 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),('FT-260728-9492',NULL,'2026-08-07','09:00 - 11:00','Dr. Hendra Wijaya','RS Siloam Surabaya','hendra.wijaya@siloamhospitals.com','+62 811 2233 4455',6,'Hospital pharmacy team benchmarking visit for sterile production standards.','Approved','2026-07-22 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),('FT-261120-4640',NULL,'2026-12-15','09:00 - 11:30','Prof. Hendra','Fakultas Farmasi UNAIR','hendra.farmasi@unair.ac.id','081234567899',40,'Studi teknologi pengisian steril Grade A','Approved','2026-11-20 08:41:56','2026-11-20 08:41:56','2026-11-20 08:41:57'),('FT-261120-6143',NULL,'2026-12-15','09:00 - 11:30','Budi','Universitas','budi.santoso@widatra.co.id','08123456789',25,'Study tour','Pending','2026-11-20 06:43:49','2026-11-20 06:43:49','2026-11-20 06:43:49');
/*!40000 ALTER TABLE `tour_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_notes`
--

DROP TABLE IF EXISTS `tour_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tour_booking_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` bigint unsigned DEFAULT NULL,
  `author_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tour_notes_tour_booking_id_foreign` (`tour_booking_id`),
  KEY `tour_notes_author_id_foreign` (`author_id`),
  CONSTRAINT `tour_notes_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tour_notes_tour_booking_id_foreign` FOREIGN KEY (`tour_booking_id`) REFERENCES `tour_bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_notes`
--

LOCK TABLES `tour_notes` WRITE;
/*!40000 ALTER TABLE `tour_notes` DISABLE KEYS */;
INSERT INTO `tour_notes` VALUES (1,'FT-261120-4640',10,'Rina Oktaviani','Siapkan APD cleanroom dan booklet CPOB untuk 40 mahasiswa.','2026-11-20 08:41:57','2026-11-20 08:41:57');
/*!40000 ALTER TABLE `tour_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_status_histories`
--

DROP TABLE IF EXISTS `tour_status_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_status_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tour_booking_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `happened_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tour_status_histories_tour_booking_id_foreign` (`tour_booking_id`),
  CONSTRAINT `tour_status_histories_tour_booking_id_foreign` FOREIGN KEY (`tour_booking_id`) REFERENCES `tour_bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_status_histories`
--

LOCK TABLES `tour_status_histories` WRITE;
/*!40000 ALTER TABLE `tour_status_histories` DISABLE KEYS */;
INSERT INTO `tour_status_histories` VALUES (1,'FT-260728-9492','Pending',NULL,'2026-07-22 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(2,'FT-260728-9492','Approved',NULL,'2026-07-23 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(3,'FT-260728-5270','Pending',NULL,'2026-07-26 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(4,'FT-260728-3680','Pending',NULL,'2026-06-30 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(5,'FT-260728-3680','Completed',NULL,'2026-07-01 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(6,'FT-260728-3929','Pending',NULL,'2026-07-25 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(7,'FT-260728-3929','Rejected','Group size exceeds our safety capacity for the requested slot — please resubmit with a smaller group or split visit.','2026-07-26 01:05:03','2026-07-28 01:05:03','2026-07-28 01:05:03'),(8,'FT-261120-6143','Pending',NULL,'2026-11-20 06:43:49','2026-11-20 06:43:49','2026-11-20 06:43:49'),(9,'FT-261120-4640','Pending',NULL,'2026-11-20 08:41:56',NULL,NULL),(10,'FT-261120-4640','Approved','Disetujui untuk sesi pagi kuota 40 orang.','2026-11-20 08:41:57',NULL,NULL);
/*!40000 ALTER TABLE `tour_status_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_type` enum('internal','external') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'external',
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'External User',
  `status` enum('Active','Disabled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_public_id_unique` (`public_id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_employee_id_unique` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'USR-SEED-0001','external','External User','Active','Ayu Pratiwi','ayu.pratiwi@example.com','+62 812 3456 7890','2026-07-28 01:05:01','$2y$12$DEVLHmrluF2ZT1H/A8ZIW.FyBw1hWKT0vi6g0DdqBZiTO2XJrMJkW',NULL,NULL,NULL,NULL,'2026-07-28 01:05:01','2026-11-20 07:01:12'),(2,'USR-SEED-0002','internal','Internal Employee','Active','Budi Santoso','budi.santoso@widatra.co.id','+62 813 9988 7766','2026-07-28 01:05:02','$2y$12$A9VXc3xsZUHicIKrs2eyO.HFraOyWCVXAY7nHJRo.m8GIQctmPVwG','WB-EMP-1042','Human Resources','HR Staff',NULL,'2026-07-28 01:05:02','2026-11-20 07:01:12'),(3,'USR-1785200702291-781','internal','Super Admin','Active','Andi Wijaya','andi.wijaya@widatra.co.id','+62 811 000 0000','2026-07-28 01:05:02','$2y$12$ydaFmc11askxDMvMrW4K4eZ.cTDNyNtR4ATU2pP3yZjd9zvs.gnji','WBK-00001','Corporate','System Administrator',NULL,'2026-07-28 01:05:02','2026-11-20 07:01:11'),(4,'USR-1785200702634-980','internal','HR Manager','Active','Sari Ningsih','sari.ningsih@widatra.co.id','+62 811 000 0000','2026-07-28 01:05:02','$2y$12$aQOSBWL35g2UGeuECRtSWeJP8gqFawuz1Et6i1aIUCf80F.Znz6zq','WBK-00002','Human Resources','HR Manager',NULL,'2026-07-28 01:05:02','2026-11-20 07:01:12'),(5,'USR-1785200702978-808','internal','Content Admin','Active','Rangga Prasetyo','rangga.prasetyo@widatra.co.id','+62 811 000 0000','2026-07-28 01:05:03','$2y$12$m4tsl7fr.9lWQdtZbmcAjeSbpNc9yfSjHjqC5dTJnV6eSd/y4FzZW','WBK-00003','Corporate Communications','Content Editor',NULL,'2026-07-28 01:05:03','2026-11-20 07:01:11'),(6,'USR-1785200703322-516','internal','CSR Coordinator','Active','Dewi Anggraini','dewi.anggraini@widatra.co.id','+62 811 000 0000','2026-07-28 01:05:03','$2y$12$kYIHIXHCmViUKH47aXdASe2E0RTeQhJXrAyOsgAF9b77912QIcz7K','WBK-00004','Corporate Communications','CSR Coordinator',NULL,'2026-07-28 01:05:03','2026-07-28 01:05:03'),(7,'USR-1785978552155-505','internal','Super Admin','Active','gaby@gmail.com','gaby@widatra.com','',NULL,'$2y$12$OLNfYrthFw.BsAZ.Cy.K3.QvdoAwwQK/isKT2.OhP3ScUbdCMdpqC','12345','IT','test',NULL,'2026-08-06 01:09:12','2026-11-20 07:01:11'),(8,'USR-1785980615183-217','external','Super Admin','Active','Gaby','gaby@gmail.com','12345',NULL,'$2y$12$nD.yME42OMG7GpKMqs4VDeu8N.0Qc49IRaOiexzgQ6MpLZVTfjFey','WBK-00005',NULL,NULL,NULL,'2026-08-06 01:43:35','2026-11-20 07:01:11'),(9,'USR-1795158070513-721','internal','Event Moderator','Active','Hendra Setiawan','hendra.setiawan@widatra.co.id','+62 811 000 0006',NULL,'$2y$12$nTLD0mDz6XUUGD4rfBAzwuXVsAbfJjHQe.P5Od2x8H1F.FNyotPTq','WBK-00006','Human Capital & Culture','Community Event Moderator',NULL,'2026-11-20 07:01:10','2026-11-20 07:01:10'),(10,'USR-1795158070873-679','internal','Factory Tour Admin','Active','Rina Oktaviani','rina.oktaviani@widatra.co.id','+62 811 000 0007',NULL,'$2y$12$NftuwVkZhtVP5bcyX83lyupPvAU3Z8KKV3xFavXouMBKP00pmAjP.','WBK-00007','Corporate Affairs & CSR','Factory Tour Coordinator',NULL,'2026-11-20 07:01:11','2026-11-20 07:01:11'),(11,'USR-1795158112237-374','external','External User','Active','fayadh','fayadh@gmail.com','123456789',NULL,'$2y$12$qOpf1pZkEwOr0/tgWvrEKeMY82GecNyWVL.WWxfcmo4Z4Zbh9cyr6',NULL,NULL,NULL,NULL,'2026-11-20 07:01:52','2026-11-23 00:26:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-24 10:13:10
