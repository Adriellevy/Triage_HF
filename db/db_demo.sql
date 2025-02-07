DROP DATABASE IF EXISTS Triagedb;

CREATE DATABASE Triagedb;

USE Triagedb;

DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Box;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS PatientUpdateHistory;
DROP TABLE IF EXISTS Tokens;

CREATE TABLE User (
  user_id BINARY(16) NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  user_full_name VARCHAR(50) NOT NULL,
  user_email VARCHAR(50) NOT NULL,
  user_specialization VARCHAR(50),
  user_password VARCHAR(100) NOT NULL,
  user_type ENUM('DOCTOR', 'NURSE', 'HOSPITAL') DEFAULT 'DOCTOR',
  PRIMARY KEY(user_id)
);

CREATE TABLE Box (
  box_id BINARY(16) NOT NULL,
  box_code VARCHAR(50) NOT NULL,
  box_type ENUM('CONSULTORIO', 'SHOCK ROOM', 'INTERNACION','OBSERVACION'),
  box_time TIMESTAMP,
  box_status ENUM('DISPONIBLE', 'OCUPADO') DEFAULT 'DISPONIBLE',
  PRIMARY KEY(box_id)
);

CREATE TABLE Patient (
  patient_id BINARY(16) NOT NULL,
  patient_name VARCHAR(250) NOT NULL,
  patient_age VARCHAR(250) NOT NULL,
  patient_entry_time TIMESTAMP NOT NULL,
  patient_exit_time TIMESTAMP,
  patient_triage_time TIMESTAMP NOT NULL,
  patient_triage_level VARCHAR(5) NOT NULL,
  patient_isolated BOOLEAN NOT NULL,
  patient_status ENUM('ALTA', 'EN OBSERVACION', 'EN ESPERA DE INTERNACION', 'INTERNADO', 'AFUERA'),
  patient_symptom VARCHAR(500) NOT NULL,
  patient_healthcare_system VARCHAR(50),
  doctor_procedure VARCHAR(50) DEFAULT NULL,
  doctor_studies_solicitated VARCHAR(50) DEFAULT NULL,
  nurse_coment VARCHAR(50) DEFAULT NULL,
  patient_observations VARCHAR(500) NULL,
  patient_records VARCHAR(500) NULL,
  patient_procedures VARCHAR(500) NULL,
  doctor_id BINARY(16),
  nurse_id BINARY(16),
  box_id BINARY(16),
  FOREIGN KEY (box_id) REFERENCES Box(box_id),
  FOREIGN KEY (doctor_id) REFERENCES User(user_id),
  FOREIGN KEY (nurse_id) REFERENCES User(user_id),
  PRIMARY KEY(patient_id)
);

CREATE TABLE PatientUpdateHistory (
  updated_id BINARY(16) NOT NULL,
  patient_updated_column VARCHAR(50) NOT NULL,
  patient_old_value VARCHAR(500),
  patient_new_value VARCHAR(500) NOT NULL,
  patient_updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  patient_id BINARY(16) NOT NULL,
  user_id BINARY(16) NOT NULL,
  PRIMARY KEY(updated_id),
  reported TINYINT(1) DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Tokens (
  token_id BINARY(16) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  user_id BINARY(16) NOT NULL,
  issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(token_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Triage (
  id int NOT NULL AUTO_INCREMENT,
  level varchar(3) NOT NULL,
  color varchar(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY level_UNIQUE (level)
);

CREATE TABLE Symptom (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE Shift(
  id INT NOT NULL AUTO_INCREMENT,
  shift_day DATE NOT NULL,
  user_id BINARY(16) NOT NULL,
  shift_start_time TINYINT NOT NULL,
  shift_end_time TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
  );

CREATE TABLE ShiftChange(
  id INT NOT NULL AUTO_INCREMENT,
  shift_id INT NOT NULL,
  last_doctor_id BINARY(16) NOT NULL,
  new_doctor_id BINARY(16) NOT NULL,
  last_nurse_id BINARY(16) NOT NULL,
  new_nurse_id BINARY(16) NOT NULL,
  shift_change_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  patient_id BINARY(16) NOT NULL,
  patient_observations VARCHAR(500) NULL,
  patient_records VARCHAR(500) NULL,
  patient_procedures VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  FOREIGN KEY (shift_id) REFERENCES Shift(id),
  FOREIGN KEY (last_doctor_id) REFERENCES User(user_id),
  FOREIGN KEY (new_doctor_id) REFERENCES User(user_id),
  FOREIGN KEY (last_nurse_id) REFERENCES User(user_id),
  FOREIGN KEY (new_nurse_id) REFERENCES User(user_id)
);

-- Insertar datos de ejemplo en la tabla User
INSERT INTO User (user_id, user_name, user_full_name, user_email, user_password, user_type) 
VALUES 
(UUID_TO_BIN(UUID()),'Dr. Smith', 'Doctor Smith', 'dr.smith@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'), 
(UUID_TO_BIN(UUID()),'Nurse Brown', 'Nurse Brown', 'nurse.brown@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'Dr. Smith2', 'Doctor Smith 2', 'admin@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'), 
(UUID_TO_BIN(UUID()),'Hospital Admin', 'Hospital Admin', 'admin@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'HOSPITAL'), 
(UUID_TO_BIN(UUID()),'GIMENEZ, ALEXIS', 'Gimenez Alexis', 'gimenez.alexis@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'VARGAS ROTELA MALENA ELIZABETH', 'Vargas Rotela Malena Elizabeth', 'vargas.rotela.malena@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'CARDOZO FACUNDO MAXIMILIANO', 'Cardozo Facundo Maximiliano', 'cardozo.facundo@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'POLO LEONARDO JAVIER', 'Polo Leonardo Javier', 'polo.leonardo@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'VARGAS JOSE ARMANDO', 'Vargas Jose Armando', 'vargas.jose@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'VILA HUAJLLIRI ROLY ROLANDO', 'Vila Huajlliri Roly Rolando', 'vila.rolando@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'MEZA ERIKA FATIMA', 'Meza Erika Fatima', 'meza.erika@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'GONZALEZ SOLEDAD', 'Gonzalez Soledad', 'gonzalez.soledad@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'VARELA MANUELA CELESTE', 'Varela Manuela Celeste', 'varela.manuela@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'CAMPOS MARIANA EVANGELINA', 'Campos Mariana Evangelina', 'campos.mariana@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'DEMINGE MARIA JOSE', 'Deminge Maria Jose', 'deminge.maria@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'DIAS SILVIA DEL VALLE', 'Dias Silvia Del Valle', 'dias.silvia@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'LEIVA LUCAS LEANDRO', 'Leiva Lucas Leandro', 'leiva.lucas@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'MOGNI EMILIO ANGEL', 'Mogni Emilio Angel', 'mogni.emilio@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'AVANCINI MARICRUZ', 'Avancini Maricruz', 'avancini.maricruz@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'GONZALES GALARZA CARLA BETIANA', 'Gonzales Galarza Carla Betiana', 'gonzales.carla@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'ZACARIAS CECILIA BEATRIZ', 'Zacarias Cecilia Beatriz', 'zacarias.cecilia@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'VALLEJOS SABRINA PAOLA', 'Vallejos Sabrina Paola', 'vallejos.sabrina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'), 
(UUID_TO_BIN(UUID()),'MESSINA NAHUEL', 'Messina Nahuel', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'), 
(UUID_TO_BIN(UUID()),'AVILA VALENTIN', 'Avila Valentin', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'), 
(UUID_TO_BIN(UUID()),'AMAYA ANALIA', 'Amaya Analia', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'), 
(UUID_TO_BIN(UUID()),'RIVAS PAULA', 'Rivas Paula', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'), 
(UUID_TO_BIN(UUID()),'RESIDENTES', 'Residentes', 'messina@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR');

-- Insertar datos de ejemplo en la tabla Box
INSERT INTO Box (box_id, box_code, box_type)
VALUES
  (UUID_TO_BIN(UUID()),'C-01','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'C-02','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'C-03','CONSULTORIO'),
  (UUID_TO_BIN(UUID()),'SR-01','SHOCK ROOM'),
  (UUID_TO_BIN(UUID()),'SR-02','SHOCK ROOM'),
  (UUID_TO_BIN(UUID()),'SR-03','SHOCK ROOM'),
  (UUID_TO_BIN(UUID()),'SR-04','SHOCK ROOM'),
  (UUID_TO_BIN(UUID()),'O-05','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-06','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-07','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-08','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-09','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-10','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-11','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-12','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-13','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-14','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-15','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-16','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-17','OBSERVACION'),
  (UUID_TO_BIN(UUID()),'O-18','OBSERVACION');

 INSERT INTO Symptom (name) VALUES
('Convulsiones'),
('Trauma de Craneo'),
('Dolor toracico / dorsal'),
('Dolor abdominal / lumbar'),
('Cefalea'),
('Deficit motor'),
('Inestabilidad en la marcha'),
('Disartria - afasia'),
('Perdida aguda de vision'),
('Disnea'),
('Sincope'),
('Mareos'),
('Edema'),
('Sangrado digestivo'),
('Otro dolor en curso'),
('Alteracion de laboratorio'),
('Sobredosis de farmacos / Ingesta de toxicos'),
('Fiebre'),
('Infeccion');

