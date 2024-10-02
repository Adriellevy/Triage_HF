import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { type Request, type Response } from 'express';
import TokensController from '../controllers/tokensController';
export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  void AuthController.login(req, res);
});

authRouter.post('/renewToken', (req: Request, res: Response) => {
  void TokensController.renewToken(req, res);
});

// authRouter.post('/register', AuthController.register)
