import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

export const userRouter = Router()

userRouter.get('/data/:id', UserController.getUserById)
userRouter.post('/getuseridbytoken', UserController.getUserIdByToken)
userRouter.get('/doctor/', UserController.getAllDoctors)
userRouter.get('/nurse/', UserController.getAllNurse)
