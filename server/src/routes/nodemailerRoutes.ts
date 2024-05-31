import { type Request, type Response, Router } from 'express';
import { NodemailerController } from '../controllers/nodemailerController';

export const nodemailerRouter = Router();

nodemailerRouter.get('/', (req: Request, res: Response) => {
  void NodemailerController.SendEmailTest(req, res);
});
