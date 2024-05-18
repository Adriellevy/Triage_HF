import { type Request, type Response, Router } from 'express';
import { SettingsController } from '../controllers/settingsController';

export const settingsRouter = Router();

settingsRouter.get('/', (req: Request, res: Response) => {
  void SettingsController.getSettings(req, res);
});
