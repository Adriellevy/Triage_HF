import { connection } from '../../db.js'

export class PatientsModel {
  static async getAllPatients() {
    const patientsQuery = `
    SELECT Patient.*, Doctor.doctor_name, Nurse.nurse_name
    FROM Patient
    LEFT JOIN Doctor ON Patient.doctor_id = Doctor.doctor_id
    LEFT JOIN Nurse ON Patient.nurse_id = Nurse.nurse_id
  `
    const [patients] = await connection.query(patientsQuery)
    return patients
  }

  static async getPatientById({ id }) {
    const patientsQuery = `
      SELECT Patient.*, Doctor.doctor_name, Nurse.nurse_name
      FROM Patient
      LEFT JOIN Doctor ON Patient.doctor_id = Doctor.doctor_id
      LEFT JOIN Nurse ON Patient.nurse_id = Nurse.nurse_id
      WHERE Patient.patient_id = ?
    `
    const [patients] = await connection.query(patientsQuery, [id])
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
