import { Router } from 'express'
import { PatientController } from '../controllers/patientController.js'

export const patientRouter = Router()

patientRouter.get('/', PatientController.getAllPatients)
patientRouter.post('/', PatientController.createNewPatient)
patientRouter.get('/:id', PatientController.getPatientById)
patientRouter.patch('/:id', PatientController.updatePatient)
patientRouter.get('/history/:id', PatientController.getPatientUpdateHistory)
