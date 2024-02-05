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
  box_id INT NOT NULL AUTO_INCREMENT,
  box_type ENUM('CONSULTORIO', 'CAMA', 'INTERNACION'),
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
  patient_status ENUM('ALTA', 'EN ESPERA', 'EN ESPERA DE INTERNACION', 'INTERNADO'),
  patient_problem VARCHAR(500) NOT NULL,
  patient_medication VARCHAR(500) NOT NULL,
  doctor_id INT,
  nurse_id INT,
  box_id INT,
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
INSERT INTO Box (box_type)
VALUES
  ('CONSULTORIO'),
  ('CAMA'),
  ('INTERNACION');

-- Insertar datos de ejemplo en la tabla Patient
INSERT INTO Patient (patient_id,patient_name, date_of_birth, entry_time, patient_triage_time, patient_triage_level, box_id, patient_status, patient_problem, patient_medication, doctor_id, nurse_id)
VALUES
  (UUID_TO_BIN(UUID()),'John Doe', '1990-01-15', '2023-01-01 08:00:00', '2023-01-01 08:30:00', 2, 1, 'EN ESPERA', 'Fever', 'Medication 1', 1, 2),
  (UUID_TO_BIN(UUID()),'Jane Smith', '1985-05-22', '2023-01-02 10:30:00', '2023-01-02 11:00:00', 3, 2, 'EN ESPERA DE INTERNACION', 'Injury', 'Medication 2', 1, 2),
  (UUID_TO_BIN(UUID()),'Bob Johnson', '1978-09-07', '2023-01-03 12:45:00', '2023-01-03 13:15:00', 1, 3, 'INTERNADO', 'Headache', 'Medication 3', 2, 1),
  (UUID_TO_BIN(UUID()),'Alice Johnson', '1980-03-12', '2023-02-05 09:15:00', '2023-02-05 09:30:00', 2, 1, 'EN ESPERA', 'Cough', 'Medication 4', 1, 2),
  (UUID_TO_BIN(UUID()),'Bob Miller', '1995-07-18', '2023-02-10 11:45:00', '2023-02-10 12:00:00', 3, 2, 'ALTA', 'Sprained ankle', 'Medication 5', 1, 2),
  (UUID_TO_BIN(UUID()),'Catherine Davis', '1988-11-25', '2023-02-15 14:30:00', '2023-02-15 14:45:00', 1, 3, 'EN ESPERA DE INTERNACION', 'Fever', 'Medication 6', 2, 1),
  (UUID_TO_BIN(UUID()),'David Wilson', '1975-04-05', '2023-02-20 16:00:00', '2023-02-20 16:15:00', 2, 1, 'EN ESPERA', 'Back pain', 'Medication 7', 1, 2),
  (UUID_TO_BIN(UUID()),'Eva Smith', '1992-09-14', '2023-02-25 18:30:00', '2023-02-25 18:45:00', 3, 2, 'INTERNADO', 'Migraine', 'Medication 8', 2, 1),
  (UUID_TO_BIN(UUID()),'Frank Jones', '1983-01-30', '2023-03-02 21:00:00', '2023-03-02 21:15:00', 1, 3, 'EN ESPERA DE INTERNACION', 'Flu', 'Medication 9', 1, 2),
  (UUID_TO_BIN(UUID()),'Grace Miller', '1970-06-08', '2023-03-07 23:45:00', '2023-03-08 00:00:00', 2, 1, 'EN ESPERA', 'Sore throat', 'Medication 10', 2, 1),
  (UUID_TO_BIN(UUID()),'Henry Johnson', '1986-12-22', '2023-03-12 02:30:00', '2023-03-12 02:45:00', 3, 2, 'INTERNADO', 'Broken arm', 'Medication 11', 1, 2),
  (UUID_TO_BIN(UUID()),'Ivy Davis', '1998-05-03', '2023-03-17 04:15:00', '2023-03-17 04:30:00', 1, 3, 'ALTA', 'Allergy', 'Medication 12', 2, 1),
  (UUID_TO_BIN(UUID()),'Jack Wilson', '1972-10-10', '2023-03-22 06:00:00', '2023-03-22 06:15:00', 2, 1, 'EN ESPERA', 'Knee pain', 'Medication 13', 1, 2);