/* eslint-disable no-useless-catch */
/* eslint-disable no-else-return */
/* eslint-disable quotes */
/* eslint-disable camelcase */
import { connection } from '../../db.js'

export class PatientsModel {
  static async getAllPatients() {
    const patientsQuery = `
    SELECT 
    BIN_TO_UUID(patient_id) AS patient_id,
    patient_name,
    date_of_birth,
    entry_time,
    exit_time,
    patient_triage_time,
    patient_triage_level,
    BIN_TO_UUID(patient.box_id) AS box_id,
    box.box_code,
    patient_status,
    patient_problem,
    patient_medication,
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name
    FROM Patient
    LEFT JOIN Users AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN Users AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    LEFT JOIN Box ON patient.box_id = Box.box_id;
    `
    const [patients] = await connection.query(patientsQuery)
    return patients
  }

  static async getPatientById({ id }) {
    const patientsQuery = `
        SELECT 
        BIN_TO_UUID(patient.patient_id) AS patient_id,
        patient.patient_name,
        patient.date_of_birth,
        patient.entry_time,
        patient.exit_time,
        patient.patient_triage_time,
        patient.patient_triage_level,
        BIN_TO_UUID(patient.box_id) AS box_id,
        box.box_code,
        patient.patient_status,
        patient.patient_problem,
        patient.patient_medication,
        Doctor.user_name AS doctor_name,
        Nurse.user_name AS nurse_name
        FROM Patient
        LEFT JOIN Users AS Doctor ON patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
        LEFT JOIN Users AS Nurse ON patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
        LEFT JOIN Box ON patient.box_id = Box.box_id  -- Agregar LEFT JOIN con la tabla Box
        WHERE patient.patient_id = UUID_TO_BIN(?);
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
    try {
      const [uuidResult] = await connection.query('SELECT UUID() uuid;')
      const [{ uuid }] = uuidResult

      const patientsQuery = `
            INSERT INTO Patient 
                (patient_id, patient_name, date_of_birth, entry_time, exit_time, patient_triage_time, patient_triage_level, 
                patient_box, patient_status, patient_problem, patient_medication, doctor_id, nurse_id, box_id) 
            VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?))
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
        const updateBoxStatusQuery = `
                UPDATE Box
                SET box_status = 'OCUPADO'
                WHERE box_id = UUID_TO_BIN(?);
            `
        await connection.query(updateBoxStatusQuery, [data.box_id])
        return uuid
      }
    } catch (error) {
      throw error
    }
  }

  static async deletePatient({ id }) {
    // TODO
  }

  static async updatePatient({ id, data }) {
    try {
      const [[Box]] = await connection.query(
        'SELECT box_id FROM Patient WHERE patient_id = UUID_TO_BIN(?)',
        [id],
      )
      const updateFields = Object.entries(data)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if (key === 'box_id') {
            return `${key} = UUID_TO_BIN(?)`
          } else {
            return `${key} = ?`
          }
        })
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
        await connection.query(
          `UPDATE Box SET box_status = 'DISPONIBLE' WHERE box_id = ?;`,
          [Box.box_id],
        )
        await connection.query(
          `UPDATE Box SET box_status = 'OCUPADO' WHERE box_id = UUID_TO_BIN(?);`,
          [data.box_id],
        )
        return { message: 'Patient updated successfully' }
      } else {
        return { error: 'Error updating the patient' }
      }
    } catch (error) {
      return { error: 'An error occurred during the update' }
    }
  }
}
