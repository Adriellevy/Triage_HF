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
    WHERE Patient.patient_status = 'EN ESPERA DE INTERNACION';
    `
    const [patients] = await connection.query(patientsQuery)
    if (patients.length === 0) return false
    return patients
  }

  static async createNewPatient({ data }) {
    // TODO
  }

  static async deletePatient({ id }) {
    // TODO
  }

  static async updatePatient({ id, data }) {
    // TODO
  }
}
