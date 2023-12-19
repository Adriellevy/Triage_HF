import { Router } from 'express'
import { PatientController } from '../controllers/patientController.js'

export const patientRouter = Router()

patientRouter.get('/', PatientController.getAllPatients)
patientRouter.get(
  '/search/awaiting-admission',
  PatientController.getPatientsAwaitingAdmission,
)
patientRouter.get('/search', PatientController.getPatientByNameOrDate)
patientRouter.post('/', PatientController.createNewPatient)
patientRouter.get('/:id', PatientController.getPatientById)
patientRouter.patch('/:id', PatientController.updatePatient)
patientRouter.delete('/:id', PatientController.deletePatient)
