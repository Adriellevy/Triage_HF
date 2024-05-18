/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Request, type Response, Router } from 'express';
import { PatientController } from '../controllers/patientController';

export const patientRouter = Router();

patientRouter.get('/', (req: Request, res: Response) => {
  void PatientController.getAllPatients(req, res);
});

patientRouter.post('/', (req: Request, res: Response) => {
  try {
    void PatientController.createNewPatient(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

patientRouter.get('/:id', (req: Request, res: Response) => {
  void PatientController.getPatientById(req, res);
});
// patientRouter.patch('/:id', PatientController.updatePatient);
patientRouter.get('/history/:id', (req: Request, res: Response) => {
  void PatientController.getPatientUpdateHistory(req, res);
});
