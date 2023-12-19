/* eslint-disable camelcase */
import { PatientsModel } from '../models/mysql/patientModel.js'
import {
  validatePartialPatient,
  validatePatient,
} from '../schemas/patientSchema.js'

export class PatientController {
  static async getAllPatients(req, res) {
    try {
      const users = await PatientsModel.getAllPatients()
      return res.json(users)
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async createNewPatient(req, res) {
    // TODO: validatePatient
    const data = validatePatient(req.body)
    if (!data.success) {
      return res.status(400).json({ error: JSON.parse(data.error.message) })
    }
    try {
      // TODO: PatientsModel.createNewPatient
      const newPatient = await PatientsModel.createNewPatient({
        data: data.data,
      })
      return res.status(201).json(newPatient)
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getPatientById(req, res) {
    try {
      const { id } = req.params
      const User = await PatientsModel.getPatientById({ id })
      if (User) return res.json(User)
      return res.status(404).json({ message: 'Patient not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getPatientByNameOrDate(req, res) {
    const { user_name, date } = req.query
    try {
      const users = await PatientsModel.getPatientByNameOrDate({
        user_name,
        date,
      })
      if (users) return res.json(users)
      return res.status(404).json({ message: 'Patient not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getPatientasdasd(req, res) {
    // Pacientes con menos de 3 minutos de espera
    // Tiempo de llegada - Tiempo de triage
    // devuelve lista de pacientes
    // estado en espera
  }

  static async getPatientsAwaitingAdmission(req, res) {
    // TODO
    try {
      const users = await PatientsModel.getPatientsAwaitingAdmission()
      if (users) return res.json(users)
      return res.status(404).json({ message: 'Patient not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async updatePatient(req, res) {
    // TODO
  }

  static async deletePatient(req, res) {
    // TODO
  }
}
