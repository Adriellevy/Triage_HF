DROP DATABASE IF EXISTS Triage_db;

CREATE DATABASE Triage_db;

USE Triage_db;

DROP TABLE IF EXISTS Doctor;

DROP TABLE IF EXISTS Nurse;

DROP TABLE IF EXISTS Patient;

CREATE TABLE Doctor (
	  doctor_id INT NOT NULL AUTO_INCREMENT,
    doctor_name VARCHAR(50) NOT NULL UNIQUE,
    doctor_number CHAR(10) NOT NULL UNIQUE,
    PRIMARY KEY(doctor_id )
);

CREATE TABLE Nurse (
	  nurse_id INT NOT NULL AUTO_INCREMENT,
    nurse_name VARCHAR(50) NOT NULL UNIQUE,
    nurse_number CHAR(10) NOT NULL UNIQUE,
    PRIMARY KEY(nurse_id )
);

CREATE TABLE Box (
	  box_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(box_id_id )
    doctor_id INT,
    patient_id INT,
    nurse_id INT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id),
    FOREIGN KEY (nurse_id) REFERENCES Nurse(nurse_id),
);

CREATE TABLE Patient (
    patient_id INT NOT NULL AUTO_INCREMENT,
    patient_name VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth TIMESTAMP NOT NULL,
    entry_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    patient_box VARCHAR(50) NOT NULL UNIQUE,
    patient_status BOOLEAN,
    patient_problem VARCHAR(500) NOT NULL
    doctor_id INT,
    nurse_id INT,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id),
    FOREIGN KEY (nurse_id) REFERENCES Nurse(nurse_id),
    PRIMARY KEY(patient_id),
);

INSERT INTO Doctor (doctor_name, doctor_number)
VALUES
  ('Dr. Smith', 'D123456789'),
  ('Dr. Johnson', 'D987654321');

INSERT INTO Nurse (nurse_name, nurse_number)
VALUES
  ('Nurse Brown', 'N456789012'),
  ('Nurse Davis', 'N789012345');

INSERT INTO Patient (patient_name, date_of_birth, entry_time, patient_box, patient_status, doctor_id, nurse_id)
VALUES
  ('John Doe', '1990-01-15', '2023-01-01 08:00:00', 'Box1', true, 1, 1),
  ('Jane Smith', '1985-05-22', '2023-01-02 10:30:00', 'Box2', false, 2, 2);
