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
    const result = await validatePatient(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    try {
      const newPatientId = await PatientsModel.createNewPatient({
        data: result.data,
      })
      if (newPatientId) {
        // eslint-disable-next-line prefer-destructuring
        const io = req.io
        io.emit('update', {
          message: 'New patient',
        })

        io.emit(`${result.data.doctor_id}`, {
          message: 'New patient assigned',
          patient: {
            patient_name: result.data.patient_name,
            patient_id: newPatientId,
          },
        })

        io.emit(`${result.data.nurse_id}`, {
          message: 'New patient assigned',
          patient: {
            patient_name: result.data.patient_name,
            patient_id: newPatientId,
          },
        })

        return res.status(201).json({
          message: 'New patient created successfully',
          // eslint-disable-next-line comma-dangle
          patientId: newPatientId,
        })
        // eslint-disable-next-line no-else-return
      }
      return res.status(500).json({ message: 'Failed to create a new patient' })
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' })
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

  static async addBoxPatient(req, res) {
    // TODO
    try {
      const users = await PatientsModel.getPatientByNameOrDate()
      if (users) return res.json(users)
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
    try {
      const users = await PatientsModel.getPatientsAwaitingAdmission()
      if (users) return res.json(users)
      return res.status(404).json({ message: 'Patient not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getPatientsAwaitingInternation(req, res) {
    try {
      const users = await PatientsModel.getPatientsAwaitingInternation()
      if (users) return res.json(users)
      return res.status(404).json({ message: 'Patient not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async updatePatient(req, res) {
    const result = validatePartialPatient(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    try {
      const { id } = req.params
      const updatedUser = await PatientsModel.updatePatient({
        id,
        data: result.data,
      })
      if (updatedUser === false) {
        return res.status(404).json({ message: 'Patient not found' })
      }
      // eslint-disable-next-line prefer-destructuring
      const io = req.io
      io.emit('update', {
        message: 'Updated patient',
      })
      try {
        const [Patient] = await PatientsModel.getPatientById({ id })
        io.emit(`${Patient.doctor_id}`, {
          message: 'Updated patient',
          patient: {
            patient_name: Patient.patient_name,
            patient_id: id,
          },
        })

        io.emit(`${Patient.nurse_id}`, {
          message: 'Updated patient',
          patient: {
            patient_name: Patient.patient_name,
            patient_id: id,
          },
        })
      } catch (e) {
        console.log(e)
      }
      return res.json(updatedUser)
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async deletePatient(req, res) {
    // TODO
  }
}
