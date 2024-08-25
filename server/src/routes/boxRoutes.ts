import { Router } from 'express';
import { BoxController } from '../controllers/boxController';
import { type Request, type Response } from 'express';

export const boxRouter = Router();

boxRouter.get('/', (req: Request, res: Response) => {
  void BoxController.getAllBoxes(req, res);
});

boxRouter.get('/available', (req: Request, res: Response) => {
  void BoxController.getAvailableBoxes(req, res);
});

boxRouter.get('/searchid/:id', (req: Request, res: Response) => {
  void BoxController.getBoxCodeById(req, res);
});

// Ruta para agregar un nuevo box
boxRouter.post('/add', (req: Request, res: Response) => {
  void BoxController.createNewBox(req, res);
});

// // Ruta para actualizar un box existente
// boxRouter.put('/update/:id', (req: Request, res: Response) => {
//   void BoxController.updateBox(req, res);
// });
