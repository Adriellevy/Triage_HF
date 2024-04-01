/* eslint-disable no-useless-catch */
/* eslint-disable no-else-return */
/* eslint-disable quotes */
/* eslint-disable camelcase */
import 'dotenv/config'
import { connection } from '../../db.js'

export class PatientsModel {
  static async getAllPatients() {
    const patientsQuery = `
    SELECT 
    BIN_TO_UUID(patient_id) AS patient_id,
    patient_name,
    patient_age,
    patient_entry_time,
    patient_exit_time,
    patient_triage_time,
    patient_triage_level,
    patient_isolated,
    BIN_TO_UUID(patient.box_id) AS box_id,
    box.box_code,
    patient_status,
    patient_symptom,
    Doctor.user_name AS doctor_name,
    Nurse.user_name AS nurse_name
    FROM Patient
    LEFT JOIN User AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
    LEFT JOIN User AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
    LEFT JOIN Box ON patient.box_id = Box.box_id;
    `
    const [patients] = await connection.query(patientsQuery)
    return patients
  }

  static async getPatientById({ id }) {
    const patientsQuery = `
        SELECT 
        BIN_TO_UUID(patient_id) AS patient_id,
        patient_name,
        patient_age,
        patient_entry_time,
        patient_exit_time,
        patient_triage_time,
        patient_triage_level,
        patient_isolated,
        BIN_TO_UUID(patient.box_id) AS box_id,
        box.box_code,
        patient_status,
        patient_symptom,
        Doctor.user_name AS doctor_name,
        Nurse.user_name AS nurse_name
        FROM Patient
        LEFT JOIN User AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
        LEFT JOIN User AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
        LEFT JOIN Box ON patient.box_id = Box.box_id
        WHERE patient.patient_id = UUID_TO_BIN(?);
    `
    const [patients] = await connection.query(patientsQuery, [id])
    if (patients.length === 0) return false
    return patients
  }

  // eslint-disable-next-line consistent-return
  static async createNewPatient({ data }) {
    try {
      const [uuidResult] = await connection.query('SELECT UUID() uuid;')
      const [{ uuid }] = uuidResult

      const patientsQuery = `
            INSERT INTO Patient 
                (
                patient_id, 
                patient_name, 
                patient_age, 
                patient_entry_time, 
                patient_exit_time, 
                patient_triage_time, 
                patient_triage_level,
                patient_isolated, 
                patient_status, 
                patient_symptom,
                patient_healthcare_system,  
                doctor_id, 
                nurse_id, 
                box_id
                ) 
            VALUES (
                    UUID_TO_BIN(?), 
                    ?,
                    STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'), 
                    STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'), 
                    ?,
                    STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'), 
                    ?, 
                    ?, 
                    ?, 
                    ?,
                    ?,
                    UUID_TO_BIN(?), 
                    UUID_TO_BIN(?), 
                    UUID_TO_BIN(?)  
                  )`
      const [result] = await connection.query(patientsQuery, [
        uuid,
        data.patient_name,
        data.patient_age,
        data.patient_entry_time,
        data.patient_exit_time,
        data.patient_triage_time,
        data.patient_triage_level,
        data.patient_isolated,
        data.patient_status,
        data.patient_symptom,
        data.patient_healthcare_system,
        data.doctor_id,
        data.nurse_id,
        data.box_id,
      ])

      const now = new Date()

      if (result.affectedRows > 0) {
        const updateBoxStatusQuery = `
                UPDATE Box
                SET box_time = ?,
                box_status = 'OCUPADO'
                WHERE box_id = UUID_TO_BIN(?);
            `
        await connection.query(updateBoxStatusQuery, [now, data.box_id])
        return uuid
      }
    } catch (error) {
      console.error(error)
    }
  }

  static async updatePatient({ id, data }) {
    try {
      console.log('info')
      console.log(data)
      const [[Box]] = await connection.query(
        'SELECT BIN_TO_UUID(box_id) AS box_id FROM Patient WHERE patient_id = UUID_TO_BIN(?)',
        [id],
      )
      const prevBox = Box.box_id
      const updateFields = Object.entries(data)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if (key === 'box_id' || key === 'nurse_id' || key === 'doctor_id') {
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
        if (data.patient_status === 'ALTA' && data.box_id !== null) {
          await connection.query(
            `
            UPDATE Patient
            SET box_id = null
            WHERE patient_id = UUID_TO_BIN(?);`,
            [id],
          )
          await connection.query(
            `UPDATE Box SET box_status = 'DISPONIBLE' WHERE box_id = UUID_TO_BIN(?);`,
            [prevBox],
          )
          return { message: 'Patient updated successfully' }
        }

        if (prevBox !== data.box_id) {
          // eslint-disable-next-line no-shadow
          const now = new Date()
          await connection.query(
            `UPDATE Box SET box_status = 'DISPONIBLE' WHERE box_id = UUID_TO_BIN(?);`,
            [prevBox],
          )
          await connection.query(
            `
            UPDATE Box
            SET box_time = ?,
            box_status = 'OCUPADO'
            WHERE box_id = UUID_TO_BIN(?)`,
            [now, data.box_id],
          )
        }
        return { message: 'Patient updated successfully' }
      } else {
        return { error: 'Error updating the patient' }
      }
    } catch (error) {
      console.error(error)
      return { error: 'An error occurred during the update' }
    }
  }

  static async getPatientUpdateHistory({ id }) {
    const PatientUpdateHistoryQuery = ` 
    SELECT 
    BIN_TO_UUID(PUH.updated_id) AS updated_id,
    PUH.patient_updated_column,
    PUH.patient_old_value,
    PUH.patient_new_value,
    PUH.patient_updated_date,
    U.user_name 
    FROM PatientUpdateHistory PUH
    JOIN User U ON PUH.user_id = U.user_id
    WHERE PUH.patient_id = UUID_TO_BIN(?);
    `
    const [PatientUpdateHistory] = await connection.query(
      PatientUpdateHistoryQuery,
      [id],
    )
    return PatientUpdateHistory
  }

  static async AddUpdateHistory({ data }) {
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    // eslint-disable-next-line object-curly-newline
    const { patient_id, updated_column, old_value, new_value, user_id } = data
    const insertQuery = `
        INSERT INTO PatientUpdateHistory (
          updated_id, 
          patient_id, 
          patient_updated_column, 
          patient_old_value, 
          patient_new_value, 
          user_id)
        VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, UUID_TO_BIN(?));
      `
    await connection.query(insertQuery, [
      uuid,
      patient_id,
      updated_column,
      old_value,
      new_value,
      user_id,
    ])
    return 1
  }

  static async getPatientsCount() {
    const patientsQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Patient
      WHERE patient_status != "ALTA";
    `
    const [result] = await connection.query(patientsQuery)
    return result[0].cantidad
  }

  static async getOutsidePatientsCount() {
    const patientsQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Patient
      WHERE patient_status = "AFUERA";
    `
    const [result] = await connection.query(patientsQuery)
    return result[0].cantidad
  }

  static async getTriageIIPatientsCount() {
    const patientsQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Patient
      WHERE patient_triage_level = 2 AND patient_status != "ALTA";
    `
    const [result] = await connection.query(patientsQuery)
    return result[0].cantidad
  }
}
