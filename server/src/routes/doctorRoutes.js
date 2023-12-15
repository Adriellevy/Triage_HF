import { Router } from 'express'
import { DoctorController } from '../controllers/doctorController.js'

export const doctorRouter = Router()

doctorRouter.get('/', DoctorController.getAllDoctors)
doctorRouter.post('/', DoctorController.createNewDoctor)
doctorRouter.get('/:id', DoctorController.getDoctorById)
doctorRouter.patch('/:id', DoctorController.updateDoctor)
doctorRouter.delete('/:id', DoctorController.deleteDoctor)
