DROP DATABASE IF EXISTS Triage_db;

CREATE DATABASE Triage_db;

USE Triage_db;

DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Box;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS PatientUpdateHistory;

CREATE TABLE User
(
    user_id             BINARY(16)   NOT NULL,
    user_name           VARCHAR(50)  NOT NULL,
    user_full_name      VARCHAR(50)  NOT NULL,
    user_email          VARCHAR(50)  NOT NULL,
    user_specialization VARCHAR(50),
    user_password       VARCHAR(100) NOT NULL,
    user_type           ENUM ('DOCTOR', 'NURSE', 'HOSPITAL') DEFAULT 'DOCTOR',
    PRIMARY KEY (user_id)
);

CREATE TABLE Box
(
    box_id     BINARY(16)  NOT NULL,
    box_code   VARCHAR(50) NOT NULL,
    box_type   ENUM ('CONSULTORIO', 'SHOCK ROOM', 'INTERNACION','OBSERVACION'),
    box_time   TIMESTAMP,
    box_status ENUM ('DISPONIBLE', 'OCUPADO') DEFAULT 'DISPONIBLE',
    PRIMARY KEY (box_id)
);

CREATE TABLE Patient
(
    patient_id                BINARY(16)   NOT NULL,
    patient_name              VARCHAR(50)  NOT NULL,
    patient_age               TIMESTAMP    NOT NULL,
    patient_entry_time        TIMESTAMP    NOT NULL,
    patient_exit_time         TIMESTAMP,
    patient_triage_time       TIMESTAMP    NOT NULL,
    patient_triage_level      INT          NOT NULL,
    patient_isolated          BOOLEAN      NOT NULL,
    patient_status            ENUM ('ALTA', 'EN OBSERVACION', 'EN ESPERA DE INTERNACION', 'INTERNADO', 'AFUERA'),
    patient_symptom           VARCHAR(500) NOT NULL,
    patient_healthcare_system VARCHAR(50),
    doctor_id                 BINARY(16),
    nurse_id                  BINARY(16),
    box_id                    BINARY(16),
    FOREIGN KEY (box_id) REFERENCES Box (box_id),
    FOREIGN KEY (doctor_id) REFERENCES User (user_id),
    FOREIGN KEY (nurse_id) REFERENCES User (user_id),
    PRIMARY KEY (patient_id)
);

CREATE TABLE PatientUpdateHistory
(
    updated_id             BINARY(16)   NOT NULL,
    patient_updated_column VARCHAR(50)  NOT NULL,
    patient_old_value      VARCHAR(500) NOT NULL,
    patient_new_value      VARCHAR(500) NOT NULL,
    patient_updated_date   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    patient_id             BINARY(16)   NOT NULL,
    user_id                BINARY(16)   NOT NULL,
    PRIMARY KEY (updated_id),
    FOREIGN KEY (patient_id) REFERENCES Patient (patient_id),
    FOREIGN KEY (user_id) REFERENCES User (user_id)
);

-- Insertar datos de ejemplo en la tabla User
INSERT INTO User (user_id, user_name, user_full_name, user_email, user_password, user_type)
VALUES (1, 'Dr. Smith', 'Doctor Smith', 'dr.smith@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
       (2, 'Nurse Brown', 'Nurse Brown', 'nurse.brown@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (3, 'Dr. Smith2', 'Doctor Smith 2', 'admin@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
       (4, 'Hospital Admin', 'Hospital Admin', 'admin@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'HOSPITAL'),
       (5, 'GIMENEZ, ALEXIS', 'Gimenez Alexis', 'gimenez.alexis@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (6, 'VARGAS ROTELA MALENA ELIZABETH', 'Vargas Rotela Malena Elizabeth',
        'vargas.rotela.malena@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (7, 'CARDOZO FACUNDO MAXIMILIANO', 'Cardozo Facundo Maximiliano',
        'cardozo.facundo@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (8, 'POLO LEONARDO JAVIER', 'Polo Leonardo Javier', 'polo.leonardo@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (9, 'VARGAS JOSE ARMANDO', 'Vargas Jose Armando', 'vargas.jose@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (10, 'VILA HUAJLLIRI ROLY ROLANDO', 'Vila Huajlliri Roly Rolando', 'vila.rolando@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (11, 'MEZA ERIKA FATIMA', 'Meza Erika Fatima', 'meza.erika@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (12, 'GONZALEZ SOLEDAD', 'Gonzalez Soledad', 'gonzalez.soledad@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (13, 'VARELA MANUELA CELESTE', 'Varela Manuela Celeste', 'varela.manuela@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (14, 'CAMPOS MARIANA EVANGELINA', 'Campos Mariana Evangelina', 'campos.mariana@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (15, 'DEMINGE MARIA JOSE', 'Deminge Maria Jose', 'deminge.maria@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (16, 'DIAS SILVIA DEL VALLE', 'Dias Silvia Del Valle', 'dias.silvia@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (17, 'LEIVA LUCAS LEANDRO', 'Leiva Lucas Leandro', 'leiva.lucas@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (18, 'MOGNI EMILIO ANGEL', 'Mogni Emilio Angel', 'mogni.emilio@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (19, 'AVANCINI MARICRUZ', 'Avancini Maricruz', 'avancini.maricruz@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (20, 'GONZALES GALARZA CARLA BETIANA', 'Gonzales Galarza Carla Betiana',
        'gonzales.carla@example.com', '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (21, 'ZACARIAS CECILIA BEATRIZ', 'Zacarias Cecilia Beatriz', 'zacarias.cecilia@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (22, 'VALLEJOS SABRINA PAOLA', 'Vallejos Sabrina Paola', 'vallejos.sabrina@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'NURSE'),
       (23, 'MESSINA NAHUEL', 'Messina Nahuel', 'messina@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
       (24, 'AVILA VALENTIN', 'Avila Valentin', 'messina@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
       (25, 'AMAYA ANALIA', 'Amaya Analia', 'messina@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
       (26, 'RIVAS PAULA', 'Rivas Paula', 'messina@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR'),
       (27, 'RESIDENTES', 'Residentes', 'messina@example.com',
        '$2b$10$9CPX0vCMdisdoqZ9tbmnQuht/ojUcTk9qpVbXrWdETcb.p96iQBIO', 'DOCTOR');

-- Insertar datos de ejemplo en la tabla Box
INSERT INTO Box (box_id, box_code, box_type)
VALUES (UUID_TO_BIN(UUID()), 'C-01', 'CONSULTORIO'),
       (UUID_TO_BIN(UUID()), 'C-02', 'CONSULTORIO'),
       (UUID_TO_BIN(UUID()), 'C-03', 'CONSULTORIO'),
       (UUID_TO_BIN(UUID()), 'SR-01', 'SHOCK ROOM'),
       (UUID_TO_BIN(UUID()), 'SR-02', 'SHOCK ROOM'),
       (UUID_TO_BIN(UUID()), 'SR-03', 'SHOCK ROOM'),
       (UUID_TO_BIN(UUID()), 'SR-04', 'SHOCK ROOM'),
       (UUID_TO_BIN(UUID()), 'O-01', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-02', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-03', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-04', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-05', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-06', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-07', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-08', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-09', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-10', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-11', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-12', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-13', 'OBSERVACION'),
       (UUID_TO_BIN(UUID()), 'O-14', 'OBSERVACION');

-- Insertar datos de ejemplo en la tabla Patient
INSERT INTO Patient
(patient_id, patient_name, patient_age, patient_entry_time, patient_exit_time, patient_triage_time,
 patient_triage_level, patient_isolated, patient_status, patient_symptom, patient_healthcare_system, doctor_id,
 nurse_id)
VALUES (UUID_TO_BIN(UUID()), 'Juan Pérez', '1980-01-01 00:00:00', '2024-03-25 10:00:00', '2024-03-25 10:30:00',
        '2024-03-25 09:00:00', 2, 1, 'ALTA', 'Fiebre', 'Healthcare System 1', 23, 2),
       (UUID_TO_BIN(UUID()), 'Ana García', '1975-01-01 00:00:00', '2024-03-26 14:00:00', '2024-03-26 14:45:00',
        '2024-03-26 11:30:00', 4, 0, 'ALTA', 'Dificultad respiratoria', 'Healthcare System 1', 24, 3),
       (UUID_TO_BIN(UUID()), 'Pedro Martínez', '1990-01-01 00:00:00', '2024-03-30 08:00:00', '2024-03-30 08:45:00',
        '2024-03-30 06:30:00', 1, 1, 'ALTA', 'Dolor de cabeza', 'Healthcare System 1', 25, 4),
       (UUID_TO_BIN(UUID()), 'Laura López', '1982-01-01 00:00:00', '2024-03-24 16:00:00', '2024-03-24 16:30:00',
        '2024-03-24 14:30:00', 3, 0, 'ALTA', 'Vómitos', 'Healthcare System 1', 26, 5),
       (UUID_TO_BIN(UUID()), 'Sofía Hernández', '1978-01-01 00:00:00', '2024-03-27 11:00:00', '2024-03-27 11:20:00',
        '2024-03-27 09:45:00', 2, 0, 'ALTA', 'Dolor en el pecho', 'Healthcare System 1', 27, 6),
       (UUID_TO_BIN(UUID()), 'Carlos González', '1985-01-01 00:00:00', '2024-03-21 10:30:00', '2024-03-21 11:15:00',
        '2024-03-21 08:45:00', 3, 1, 'ALTA', 'Mareos', 'Healthcare System 1', 23, 7);