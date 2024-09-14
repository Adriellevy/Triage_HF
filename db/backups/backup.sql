-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: Triage_db
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `Box`
--

DROP TABLE IF EXISTS `Box`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Box` (
  `box_id` binary(16) NOT NULL,
  `box_code` varchar(50) NOT NULL,
  `box_type` enum('CONSULTORIO','SHOCK ROOM','INTERNACION','OBSERVACION') DEFAULT NULL,
  `box_time` timestamp NULL DEFAULT NULL,
  `box_status` enum('DISPONIBLE','OCUPADO') DEFAULT 'DISPONIBLE',
  PRIMARY KEY (`box_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Box`
--

LOCK TABLES `Box` WRITE;
/*!40000 ALTER TABLE `Box` DISABLE KEYS */;
INSERT INTO `Box` VALUES (_binary 'œ®!\'m\Ô∞:B¨\0','C-01','CONSULTORIO',NULL,'DISPONIBLE'),(_binary 'œ®\'Äm\Ô∞:B¨\0','C-02','CONSULTORIO',NULL,'DISPONIBLE'),(_binary 'œ®)im\Ô∞:B¨\0','C-03','CONSULTORIO',NULL,'DISPONIBLE'),(_binary 'œ®)\ÿm\Ô∞:B¨\0','SR-01','SHOCK ROOM',NULL,'DISPONIBLE'),(_binary 'œ®*m\Ô∞:B¨\0','SR-02','SHOCK ROOM',NULL,'DISPONIBLE'),(_binary 'œ®*Im\Ô∞:B¨\0','SR-03','SHOCK ROOM',NULL,'DISPONIBLE'),(_binary 'œ®*~m\Ô∞:B¨\0','SR-04','SHOCK ROOM',NULL,'DISPONIBLE'),(_binary 'œ®*∞m\Ô∞:B¨\0','O-05','OBSERVACION','2024-09-07 18:46:32','OCUPADO'),(_binary 'œ®*\Ëm\Ô∞:B¨\0','O-06','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®+m\Ô∞:B¨\0','O-07','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®+Rm\Ô∞:B¨\0','O-08','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®+Ñm\Ô∞:B¨\0','O-09','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®,7m\Ô∞:B¨\0','O-10','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®,gm\Ô∞:B¨\0','O-11','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®,òm\Ô∞:B¨\0','O-12','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®,\ m\Ô∞:B¨\0','O-13','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®,˚m\Ô∞:B¨\0','O-14','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®-/m\Ô∞:B¨\0','O-15','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®-cm\Ô∞:B¨\0','O-16','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®-ìm\Ô∞:B¨\0','O-17','OBSERVACION',NULL,'DISPONIBLE'),(_binary 'œ®.Pm\Ô∞:B¨\0','O-18','OBSERVACION',NULL,'DISPONIBLE');
/*!40000 ALTER TABLE `Box` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Patient`
--

DROP TABLE IF EXISTS `Patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Patient` (
  `patient_id` binary(16) NOT NULL,
  `patient_name` varchar(50) NOT NULL,
  `patient_age` datetime NOT NULL,
  `patient_entry_time` timestamp NOT NULL,
  `patient_exit_time` timestamp NULL DEFAULT NULL,
  `patient_triage_time` timestamp NOT NULL,
  `patient_triage_level` int NOT NULL,
  `patient_isolated` tinyint(1) NOT NULL,
  `patient_status` enum('ALTA','EN OBSERVACION','EN ESPERA DE INTERNACION','INTERNADO','AFUERA') DEFAULT NULL,
  `patient_symptom` varchar(500) NOT NULL,
  `patient_healthcare_system` varchar(50) DEFAULT NULL,
  `doctor_procedure` varchar(50) DEFAULT NULL,
  `doctor_studies_solicitated` varchar(50) DEFAULT NULL,
  `nurse_coment` varchar(50) DEFAULT NULL,
  `doctor_id` binary(16) DEFAULT NULL,
  `nurse_id` binary(16) DEFAULT NULL,
  `box_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`patient_id`),
  KEY `box_id` (`box_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `nurse_id` (`nurse_id`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`box_id`) REFERENCES `Box` (`box_id`),
  CONSTRAINT `patient_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `patient_ibfk_3` FOREIGN KEY (`nurse_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Patient`
--

LOCK TABLES `Patient` WRITE;
/*!40000 ALTER TABLE `Patient` DISABLE KEYS */;
INSERT INTO `Patient` VALUES (_binary '\√]\ﬁmIÔñéB¨\0','Test','1992-01-01 00:00:00','2024-09-07 18:46:32',NULL,'2024-09-07 18:46:32',1,0,'EN OBSERVACION','Dolor abdominal / lumbar','Test',NULL,NULL,'default',_binary 'œ¶zßm\Ô∞:B¨\0',_binary 'œ¶u\«m\Ô∞:B¨\0',_binary 'œ®*∞m\Ô∞:B¨\0');
/*!40000 ALTER TABLE `Patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PatientUpdateHistory`
--

DROP TABLE IF EXISTS `PatientUpdateHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PatientUpdateHistory` (
  `updated_id` binary(16) NOT NULL,
  `patient_updated_column` varchar(50) NOT NULL,
  `patient_old_value` varchar(500) DEFAULT NULL,
  `patient_new_value` varchar(500) NOT NULL,
  `patient_updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `patient_id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  PRIMARY KEY (`updated_id`),
  KEY `patient_id` (`patient_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `patientupdatehistory_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`),
  CONSTRAINT `patientupdatehistory_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PatientUpdateHistory`
--

LOCK TABLES `PatientUpdateHistory` WRITE;
/*!40000 ALTER TABLE `PatientUpdateHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `PatientUpdateHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` binary(16) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_full_name` varchar(50) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_specialization` varchar(50) DEFAULT NULL,
  `user_password` varchar(100) NOT NULL,
  `user_type` enum('DOCTOR','NURSE','HOSPITAL') DEFAULT 'DOCTOR',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (_binary 'œ¶km\Ô∞:B¨\0','Dr. Smith','Doctor Smith','dr.smith@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','DOCTOR'),(_binary 'œ¶p\»m\Ô∞:B¨\0','Nurse Brown','Nurse Brown','nurse.brown@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶s≠m\Ô∞:B¨\0','Dr. Smith2','Doctor Smith 2','admin@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','DOCTOR'),(_binary 'œ¶u%m\Ô∞:B¨\0','Hospital Admin','Hospital Admin','admin@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','HOSPITAL'),(_binary 'œ¶uxm\Ô∞:B¨\0','GIMENEZ, ALEXIS','Gimenez Alexis','gimenez.alexis@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶u\«m\Ô∞:B¨\0','VARGAS ROTELA MALENA ELIZABETH','Vargas Rotela Malena Elizabeth','vargas.rotela.malena@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶v\Zm\Ô∞:B¨\0','CARDOZO FACUNDO MAXIMILIANO','Cardozo Facundo Maximiliano','cardozo.facundo@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶vcm\Ô∞:B¨\0','POLO LEONARDO JAVIER','Polo Leonardo Javier','polo.leonardo@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶v∂m\Ô∞:B¨\0','VARGAS JOSE ARMANDO','Vargas Jose Armando','vargas.jose@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶vˇm\Ô∞:B¨\0','VILA HUAJLLIRI ROLY ROLANDO','Vila Huajlliri Roly Rolando','vila.rolando@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶wOm\Ô∞:B¨\0','MEZA ERIKA FATIMA','Meza Erika Fatima','meza.erika@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶wêm\Ô∞:B¨\0','GONZALEZ SOLEDAD','Gonzalez Soledad','gonzalez.soledad@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶w\‘m\Ô∞:B¨\0','VARELA MANUELA CELESTE','Varela Manuela Celeste','varela.manuela@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶x\Zm\Ô∞:B¨\0','CAMPOS MARIANA EVANGELINA','Campos Mariana Evangelina','campos.mariana@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶xfm\Ô∞:B¨\0','DEMINGE MARIA JOSE','Deminge Maria Jose','deminge.maria@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶x≤m\Ô∞:B¨\0','DIAS SILVIA DEL VALLE','Dias Silvia Del Valle','dias.silvia@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶x˙m\Ô∞:B¨\0','LEIVA LUCAS LEANDRO','Leiva Lucas Leandro','leiva.lucas@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶yCm\Ô∞:B¨\0','MOGNI EMILIO ANGEL','Mogni Emilio Angel','mogni.emilio@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶yãm\Ô∞:B¨\0','AVANCINI MARICRUZ','Avancini Maricruz','avancini.maricruz@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶y\Œm\Ô∞:B¨\0','GONZALES GALARZA CARLA BETIANA','Gonzales Galarza Carla Betiana','gonzales.carla@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶zm\Ô∞:B¨\0','ZACARIAS CECILIA BEATRIZ','Zacarias Cecilia Beatriz','zacarias.cecilia@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶z]m\Ô∞:B¨\0','VALLEJOS SABRINA PAOLA','Vallejos Sabrina Paola','vallejos.sabrina@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','NURSE'),(_binary 'œ¶zßm\Ô∞:B¨\0','MESSINA NAHUEL','Messina Nahuel','messina@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','DOCTOR'),(_binary 'œ¶z\Êm\Ô∞:B¨\0','AVILA VALENTIN','Avila Valentin','messina@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','DOCTOR'),(_binary 'œ¶{-m\Ô∞:B¨\0','AMAYA ANALIA','Amaya Analia','messina@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','DOCTOR'),(_binary 'œ¶{pm\Ô∞:B¨\0','RIVAS PAULA','Rivas Paula','messina@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','DOCTOR'),(_binary 'œ¶{≥m\Ô∞:B¨\0','RESIDENTES','Residentes','messina@example.com',NULL,'$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO','DOCTOR');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-07 19:17:54
