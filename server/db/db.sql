DROP DATABASE IF EXISTS Triage_db;

CREATE DATABASE Triage_db;

USE Triage_db;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Box;
DROP TABLE IF EXISTS Patient;

CREATE TABLE Users (
  user_id INT NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(50) NOT NULL,
  user_email VARCHAR(50) NOT NULL,
  user_password VARCHAR(100) NOT NULL,
  user_type ENUM('DOCTOR', 'NURSE', 'HOSPITAL'),
  PRIMARY KEY(user_id)
);

CREATE TABLE Box (
  box_id BINARY(16) NOT NULL,
  box_code VARCHAR(50) NOT NULL,
  box_type ENUM('CONSULTORIO', 'CAMA', 'INTERNACION'),
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
  doctor_id INT,
  nurse_id INT,
  box_id BINARY(16),
  FOREIGN KEY (box_id) REFERENCES Box(box_id),
  FOREIGN KEY (doctor_id) REFERENCES Users(user_id),
  FOREIGN KEY (nurse_id) REFERENCES Users(user_id),
  PRIMARY KEY(patient_id)
);

-- Insertar datos de ejemplo en la tabla Users
INSERT INTO Users (user_name, user_email, user_password, user_type)
VALUES
  ('Dr. Smith', 'dr.smith@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  ('Nurse Brown', 'nurse.brown@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
  ('Dr. Smith2', 'admin@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
  ('Hospital Admin', 'admin@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'HOSPITAL');

-- Insertar datos de ejemplo en la tabla Box
INSERT INTO Box (box_id, box_code, box_type)
VALUES
  (UUID_TO_BIN(UUID()),'01','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'02','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'03','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'04','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'05','CAMA'),
  (UUID_TO_BIN(UUID()),'06','CAMA'),
  (UUID_TO_BIN(UUID()),'07','CAMA'),
  (UUID_TO_BIN(UUID()),'08','CAMA'),
  (UUID_TO_BIN(UUID()),'09','INTERNACION'),
  (UUID_TO_BIN(UUID()),'10','INTERNACION'),
  (UUID_TO_BIN(UUID()),'11','INTERNACION'),
  (UUID_TO_BIN(UUID()),'12','INTERNACION');