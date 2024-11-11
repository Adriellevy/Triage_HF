import { type Request, type Response, Router } from 'express';
import { PatientController } from '../controllers/patientController';

export const patientRouter = Router();

// patientRouter.get('/', (req: Request, res: Response) => {
//   void PatientController.getAllPatients(req, res);
// });

patientRouter.post('/', (req: Request, res: Response) => {
  void PatientController.createNewPatient(req, res);
});

patientRouter.get('/:id', (req: Request, res: Response) => {
  void PatientController.getPatientById(req, res);
});

patientRouter.get('/patientName/:name', (req: Request, res: Response) => {
  void PatientController.getPatientByName(req, res);
});

patientRouter.get('/patientsByUserID/:user_id', (req: Request, res: Response) => {
  void PatientController.getPatientsByUser(req, res)
})
patientRouter.post('/patientsByFilters', (req: Request, res: Response) => {
  void PatientController.getUsersByFilter(req, res); //cambiar nombre a patient
});

patientRouter.post('/patientsByDate', (req: Request, res: Response) => {
  void PatientController.getUsersByDate(req, res); //cambiar nombre a patient
});

patientRouter.patch('/:id', (req: Request, res: Response) => {
  void PatientController.updatePatient(req, res);
});


patientRouter.get('/history/:id', (req: Request, res: Response) => {
  void PatientController.getPatientUpdateHistory(req, res);
});

