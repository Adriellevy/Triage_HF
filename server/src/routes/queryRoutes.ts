import { type Request, type Response, Router } from 'express';
import { queryController } from '../controllers/queryController';

export const queryRoutes = Router();

queryRoutes.get('/:query', (req: Request, res: Response) => {
  console.log('llego la req al router');
  void queryController.getUsersByQuery(req, res);
});
