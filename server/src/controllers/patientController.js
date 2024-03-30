/* eslint-disable operator-linebreak */
/* eslint-disable camelcase */
import jwt from 'jsonwebtoken'
import 'dotenv/config'
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
    // eslint-disable-next-line operator-linebreak
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userID = decoded.id

    if (!result.success) {
      return res.status(500).json({ error: JSON.parse(result.error) })
    }
    console.log(result.data)
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

        io.emit('update', {
          message: 'Box Update',
        })

        if (userID !== result.data.doctor_id) {
          io.emit(`${result.data.doctor_id}`, {
            message: 'New patient assigned',
            patient: {
              patient_name: result.data.patient_name,
              patient_id: newPatientId,
            },
          })
        }
        if (userID !== result.data.nurse_id) {
          io.emit(`${result.data.nurse_id}`, {
            message: 'New patient assigned',
            patient: {
              patient_name: result.data.patient_name,
              patient_id: newPatientId,
            },
          })
        }
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

  static async updatePatient(req, res) {
    const result = validatePartialPatient(req.body)

    // eslint-disable-next-line operator-linebreak
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userID = decoded.id
    console.log(userID)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    try {
      const { id } = req.params

      const [UserAntiguo] = await PatientsModel.getPatientById({ id })

      const UserNuevo = result.data

      const cambios = []
      const tiempoActual = new Date()

      // eslint-disable-next-line no-restricted-syntax
      for (const key in UserNuevo) {
        if (
          // eslint-disable-next-line no-prototype-builtins
          UserAntiguo.hasOwnProperty(key) &&
          UserAntiguo[key] !== UserNuevo[key]
        ) {
          cambios.push({
            patient_id: UserAntiguo.patient_id,
            updated_column: key,
            old_value: UserAntiguo[key],
            new_value: UserNuevo[key],
            update_date: tiempoActual.toISOString(),
            user_id: userID,
          })
        }
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const item of cambios) {
        // eslint-disable-next-line no-await-in-loop
        await PatientsModel.AddUpdateHistory({ data: item })
      }
      const updatedUser = await PatientsModel.updatePatient({
        id,
        data: result.data,
      })
      if (updatedUser === false) {
        return res.status(404).json({ message: 'Patient not found' })
      }

      const { io } = req
      io.emit('update', {
        message: 'Updated patient',
      })
      try {
        const [Patient] = await PatientsModel.getPatientById({ id })

        if (userID !== result.data.doctor_id) {
          io.emit(`${result.data.doctor_id}`, {
            message: 'Updated patient',
            patient: {
              patient_name: Patient.patient_name,
              patient_id: id,
            },
          })
        }

        if (userID !== result.data.nurse_id) {
          io.emit(`${result.data.nurse_id}`, {
            message: 'Updated patient',
            patient: {
              patient_name: Patient.patient_name,
              patient_id: id,
            },
          })
        }

        io.emit('update', {
          message: 'Box Update',
        })
      } catch (e) {
        console.log(e)
      }
      return res.json(updatedUser)
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getPatientUpdateHistory(req, res) {
    try {
      const { id } = req.params
      const UpdateHistory = await PatientsModel.getPatientUpdateHistory({ id })
      return res.json(UpdateHistory)
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }
}
