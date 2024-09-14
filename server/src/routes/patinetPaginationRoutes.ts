import { type Request, type Response, Router } from 'express';
import { PatientController } from '../controllers/patientController';

export const patientPatinationRouter = Router();

patientPatinationRouter.get('/:batch', (req: Request, res: Response) => {
  void PatientController.getPaginatedPatients(req, res);
});
