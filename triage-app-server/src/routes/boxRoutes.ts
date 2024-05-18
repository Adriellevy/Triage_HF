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
