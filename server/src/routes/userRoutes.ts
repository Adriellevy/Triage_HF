import { type Request, type Response, Router } from 'express';
import { UserController } from '../controllers/userController';

export const userRouter = Router();

userRouter.get('/data/:id', (req: Request, res: Response) => {
  void UserController.getUserById(req, res);
});

userRouter.post('/getuseridbytoken', (req: Request, res: Response) => {
  void UserController.getUserIdByToken(req, res);
});

userRouter.get('/doctor', (req: Request, res: Response) => {
  void UserController.getAllDoctors(req, res);
});

userRouter.get('/nurse', (req: Request, res: Response) => {
  void UserController.getAllNurse(req, res);
});

userRouter.get('/users', (req: Request, res: Response) => {
  void UserController.getAllUsers(req, res);
});
