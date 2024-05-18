import { Router } from 'express';
import { type Request, type Response } from 'express';
import { DashboardController } from '../controllers/dashboardController';

export const dashboardRouter = Router();

dashboardRouter.get('/', (req: Request, res: Response) => {
  void DashboardController.getDashboardData(req, res);
});
