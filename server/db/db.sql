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
  user_password VARCHAR(50) NOT NULL,
  user_type ENUM('DOCTOR', 'NURSE', 'HOSPITAL'),
  PRIMARY KEY(user_id)
);

CREATE TABLE Box (
  box_id INT NOT NULL AUTO_INCREMENT,
  box_type ENUM('CONSULTORIO', 'CAMA', 'INTERNACION'),
  PRIMARY KEY(box_id)
);

CREATE TABLE Patient (
  patient_id INT NOT NULL AUTO_INCREMENT,
  patient_name VARCHAR(50) NOT NULL UNIQUE,
  date_of_birth TIMESTAMP NOT NULL,
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP,
  patient_triage_time TIMESTAMP NOT NULL,
  patient_triage_level INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  patient_box VARCHAR(50) DEFAULT NULL,
  patient_status BOOLEAN,
  patient_problem VARCHAR(500) NOT NULL,
  doctor_id INT,
  nurse_id INT,
  box_id INT,
  FOREIGN KEY (box_id) REFERENCES Box(box_id),
  FOREIGN KEY (doctor_id) REFERENCES Users(user_id),
  FOREIGN KEY (nurse_id) REFERENCES Users(user_id),
  PRIMARY KEY(patient_id)
);

-- Insertar datos de ejemplo en la tabla User
INSERT INTO Users (user_name, user_email, user_password, user_type)
VALUES
  ('Dr. Smith', 'dr.smith@example.com', 'password123', 'DOCTOR'),
  ('Nurse Brown', 'nurse.brown@example.com', 'password456', 'NURSE'),
  ('Hospital Admin', 'admin@example.com', 'adminpassword', 'HOSPITAL');

-- Insertar datos de ejemplo en la tabla Box
INSERT INTO Box (box_type)
VALUES
  ('CONSULTORIO'),
  ('CAMA'),
  ('INTERNACION');

-- Insertar datos de ejemplo en la tabla Patient
INSERT INTO Patient (patient_name, date_of_birth, entry_time, patient_triage_time, patient_triage_level, box_id, patient_status, patient_problem, doctor_id, nurse_id)
VALUES
  ('John Doe', '1990-01-15', '2023-01-01 08:00:00', '2023-01-01 08:30:00', 2, 1, true, 'Fever', 1, 2),
  ('Jane Smith', '1985-05-22', '2023-01-02 10:30:00', '2023-01-02 11:00:00', 3, 2, false, 'Injury', 1, 2),
  ('Bob Johnson', '1978-09-07', '2023-01-03 12:45:00', '2023-01-03 13:15:00', 1, 3, true, 'Headache', 2, 1);
