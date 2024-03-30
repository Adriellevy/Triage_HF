DROP DATABASE IF EXISTS Triage_db;

CREATE DATABASE Triage_db;

USE Triage_db;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Box;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS PatientUpdateHistory;

CREATE TABLE Users (
  user_id BINARY(16) NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  user_email VARCHAR(50) NOT NULL,
  user_password VARCHAR(100) NOT NULL,
  user_type ENUM('DOCTOR', 'NURSE', 'HOSPITAL'),
  PRIMARY KEY(user_id)
);

CREATE TABLE Box (
  box_id BINARY(16) NOT NULL,
  box_code VARCHAR(50) NOT NULL,
  box_type ENUM('CONSULTORIO', 'SHOOCK ROOM', 'INTERNACION','OBSERVACION'),
  box_time TIMESTAMP,
  box_status ENUM('DISPONIBLE', 'OCUPADO') DEFAULT 'DISPONIBLE',
  PRIMARY KEY(box_id)
);

CREATE TABLE Patient (
  patient_id BINARY(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  patient_name VARCHAR(50) NOT NULL,
  date_of_birth TIMESTAMP NOT NULL,
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP,
  patient_triage_time TIMESTAMP NOT NULL,
  patient_triage_level INT,
  patient_box VARCHAR(50) DEFAULT NULL,
  patient_status ENUM('ALTA', 'EN ESPERA', 'EN ESPERA DE INTERNACION', 'INTERNADO', 'AFUERA', 'EN AISLAMIENTO'),
  patient_problem VARCHAR(500) NOT NULL,
  patient_medication VARCHAR(500) NOT NULL,
  doctor_id BINARY(16),
  nurse_id BINARY(16),
  box_id BINARY(16),
  FOREIGN KEY (box_id) REFERENCES Box(box_id),
  FOREIGN KEY (doctor_id) REFERENCES Users(user_id),
  FOREIGN KEY (nurse_id) REFERENCES Users(user_id),
  PRIMARY KEY(patient_id)
);

CREATE TABLE PatientUpdateHistory (
  update_id BINARY(16) NOT NULL,
  patient_id BINARY(16) NOT NULL,
  updated_column VARCHAR(50) NOT NULL,
  old_value VARCHAR(500) NOT NULL,
  new_value VARCHAR(500) NOT NULL,
  update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id BINARY(16) NOT NULL,
  PRIMARY KEY(update_id),
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Insertar datos de ejemplo en la tabla Users
INSERT INTO Users (user_id, user_name, user_email, user_password, user_type)
VALUES
  (UUID_TO_BIN(UUID()),'Dr. Smith', 'dr.smith@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  (UUID_TO_BIN(UUID()),'Nurse Brown', 'nurse.brown@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'Dr. Smith2', 'admin@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  (UUID_TO_BIN(UUID()),'Hospital Admin', 'admin@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'HOSPITAL'),
  (UUID_TO_BIN(UUID()),'GIMENEZ, ALEXIS', 'gimenez.alexis@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'VARGAS ROTELA MALENA ELIZABETH', 'vargas.rotela.malena@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'CARDOZO FACUNDO MAXIMILIANO', 'cardozo.facundo@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'POLO LEONARDO JAVIER', 'polo.leonardo@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'VARGAS JOSE ARMANDO', 'vargas.jose@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'VILA HUAJLLIRI ROLY ROLANDO', 'vila.rolando@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'MEZA ERIKA FATIMA', 'meza.erika@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'GONZALEZ SOLEDAD', 'gonzalez.soledad@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'VARELA MANUELA CELESTE', 'varela.manuela@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'CAMPOS MARIANA EVANGELINA', 'campos.mariana@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'DEMINGE MARIA JOSE', 'deminge.maria@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'DIAS SILVIA DEL VALLE', 'dias.silvia@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'LEIVA LUCAS LEANDRO', 'leiva.lucas@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'MOGNI EMILIO ANGEL', 'mogni.emilio@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'AVANCINI MARICRUZ', 'avancini.maricruz@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'GONZALES GALARZA CARLA BETIANA', 'gonzales.carla@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'ZACARIAS CECILIA BEATRIZ', 'zacarias.cecilia@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'VALLEJOS SABRINA PAOLA', 'vallejos.sabrina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  (UUID_TO_BIN(UUID()),'MESSINA NAHUEL', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  (UUID_TO_BIN(UUID()),'AVILA VALENTIN', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  (UUID_TO_BIN(UUID()),'AMAYA ANALIA', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  (UUID_TO_BIN(UUID()),'RIVAS PAULA', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  (UUID_TO_BIN(UUID()),'RESIDENTES', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR');

-- Insertar datos de ejemplo en la tabla Box
INSERT INTO Box (box_id, box_code, box_type)
VALUES
  (UUID_TO_BIN(UUID()),'C1','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'C2','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'C3','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'01','SHOOCK ROOM'),
  (UUID_TO_BIN(UUID()),'02','SHOOCK ROOM'),
  (UUID_TO_BIN(UUID()),'03','SHOOCK ROOM'),
  (UUID_TO_BIN(UUID()),'04','SHOOCK ROOM'),
  (UUID_TO_BIN(UUID()),'05','INTERNACION'),
  (UUID_TO_BIN(UUID()),'06','INTERNACION'),
  (UUID_TO_BIN(UUID()),'07','INTERNACION'),
  (UUID_TO_BIN(UUID()),'08','INTERNACION'),
  (UUID_TO_BIN(UUID()),'09','INTERNACION'),
  (UUID_TO_BIN(UUID()),'10','INTERNACION'),
  (UUID_TO_BIN(UUID()),'11','INTERNACION'),
  (UUID_TO_BIN(UUID()),'12','INTERNACION'),
  (UUID_TO_BIN(UUID()),'13','INTERNACION'),
  (UUID_TO_BIN(UUID()),'14','INTERNACION'),
  (UUID_TO_BIN(UUID()),'15','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'16','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'17','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'18','OBSERVACION');
