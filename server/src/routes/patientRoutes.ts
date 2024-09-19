import { type Request, type Response, Router } from 'express';
import { PatientController } from '../controllers/patientController';

export const patientRouter = Router();

patientRouter.get('/', (req: Request, res: Response) => {
  void PatientController.getAllPatients(req, res);
});

patientRouter.post('/', (req: Request, res: Response) => {
  void PatientController.createNewPatient(req, res);
});

patientRouter.get('/:id', (req: Request, res: Response) => {
  void PatientController.getPatientById(req, res);
});

patientRouter.get('/patientName/:name', (req: Request, res: Response) => {
  void PatientController.getPatientByName(req, res);
});

patientRouter.post('/patientsByFilters/', (req: Request, res: Response) => {
  void PatientController.getUsersByFilter(req, res);
});

patientRouter.patch('/:id', (req: Request, res: Response) => {
  void PatientController.updatePatient(req, res);
});

patientRouter.get('/history/:id', (req: Request, res: Response) => {
  void PatientController.getPatientUpdateHistory(req, res);
});
