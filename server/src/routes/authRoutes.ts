import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { type Request, type Response } from 'express';
export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  void AuthController.login(req, res);
});

// authRouter.post('/register', AuthController.register)
