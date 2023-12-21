/* eslint-disable no-else-return */
/* eslint-disable quotes */
/* eslint-disable camelcase */
import { connection } from '../../db.js'

export class PatientsModel {
  static async getAllPatients() {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE';
    `
    const [patients] = await connection.query(patientsQuery)
    return patients
  }

  static async getPatientById({ id }) {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    WHERE Patient.patient_id = ?;
    `
    const [patients] = await connection.query(patientsQuery, [id])
    if (patients.length === 0) return false
    return patients
  }

  static async getPatientByNameOrDate({ user_name, date }) {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    WHERE Patient.patient_name = ? OR Patient.date_of_birth = ?;
    `
    const [patients] = await connection.query(patientsQuery, [user_name, date])
    if (patients.length === 0) return false
    return patients
  }

  static async getPatientsAwaitingAdmission() {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    WHERE Patient.patient_status = 'EN ESPERA';
    `
    const [patients] = await connection.query(patientsQuery)
    if (patients.length === 0) return false
    return patients
  }

  static async getPatientsAwaitingInternation() {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    WHERE Patient.patient_status = 'EN ESPERA DE INTERNACION';
    `
    const [patients] = await connection.query(patientsQuery)
    if (patients.length === 0) return false
    return patients
  }

  static async createNewPatient({ data }) {
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    const patientsQuery = `INSERT INTO Patient 
    (patient_id, patient_name, date_of_birth, entry_time, exit_time, patient_triage_time, patient_triage_level, 
    patient_box, patient_status, patient_problem, patient_medication, doctor_id, nurse_id, box_id) 
    VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
    const [result] = await connection.query(patientsQuery, [
      uuid,
      data.patient_name,
      data.date_of_birth,
      data.entry_time,
      data.exit_time,
      data.patient_triage_time,
      data.patient_triage_level,
      data.patient_box,
      data.patient_status,
      data.patient_problem,
      data.patient_medication,
      data.doctor_id,
      data.nurse_id,
      data.box_id,
    ])
    // Verificar el resultado de la consulta
    // console.log(result)
    // console.log(result.affectedRows)
    if (result.affectedRows > 0) {
      // console.log('Nuevo paciente insertado con éxito.')
      return { message: 'Nuevo paciente insertado con éxito.' }
    } else {
      console.error('Error al insertar un nuevo paciente.')
      return { error: 'Error al insertar un nuevo paciente.' }
    }
  }

  /*
  const { userName, phoneNumber, emailAddress } = data
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        'INSERT INTO users(id, userName, email_adress, phoneNumber)VALUES(UUID_TOBIN(?),?,?,?);',
        [uuid, userName, phoneNumber, emailAddress],
      )
    } catch (error) {
      throw new Error('Error crating a new user')
    }

    const [user] = await connection.query(
      'SELECT * FROM users WHERE user_id=?',
      [uuid],
    )
    return user
  */
  static async deletePatient({ id }) {
    // TODO
  }

  static async updatePatient({ id, data }) {
    // TODO
  }
}
