/* eslint-disable no-else-return */
/* eslint-disable quotes */
/* eslint-disable camelcase */
import { connection } from '../../db.js'

export class PatientsModel {
  static async getAllPatients() {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name,
    BIN_TO_UUID(patient_id) patient_id 
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    ;
    `
    const [patients] = await connection.query(patientsQuery)
    return patients
  }

  static async getPatientById({ id }) {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name,
    BIN_TO_UUID(patient_id) patient_id 
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    WHERE Patient.patient_id = UUID_TO_BIN(?);
    `
    const [patients] = await connection.query(patientsQuery, [id])
    if (patients.length === 0) return false
    return patients
  }

  static async getPatientByNameOrDate({ user_name, date }) {
    const patientsQuery = `
    SELECT Patient.*, 
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name,
    BIN_TO_UUID(patient_id) patient_id 
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
    Nurse.user_name AS nurse_name,
    BIN_TO_UUID(patient_id) patient_id 
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
    Nurse.user_name AS nurse_name,
    BIN_TO_UUID(patient_id) patient_id 
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
    if (result.affectedRows > 0) {
      return { message: 'New patient inserted successfully' }
    } else {
      return { error: 'Error inserting a new patient' }
    }
  }

  static async deletePatient({ id }) {
    // TODO
  }

  static async updatePatient({ id, data }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const updateFields = Object.entries(data)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key]) => `${key} = ?`)
        .join(', ')

      const patientsUpdateQuery = `
        UPDATE Patient
        SET ${updateFields}
        WHERE patient_id = UUID_TO_BIN(?);
      `
      const updateValues = Object.values(data).filter(
        (value) => value !== null && value !== undefined,
      )
      updateValues.push(id)
      const [result] = await connection.query(patientsUpdateQuery, updateValues)
      if (result.affectedRows > 0) {
        return { message: 'Patient updated successfully' }
      } else {
        return { error: 'Error updating the patient' }
      }
    } catch (error) {
      throw error
    }
  }
}
