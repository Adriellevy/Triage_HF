import { Router } from 'express'
import { NodemailerController } from '../controllers/nodemailerController.js'

export const nodemailerRouter = Router()

nodemailerRouter.get('/', NodemailerController.SendEmailTest)
