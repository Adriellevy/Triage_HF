import { Router } from 'express'
import { BoxController } from '../controllers/boxController.js'

export const boxRouter = Router()

boxRouter.get('/', BoxController.getAllBoxes)

boxRouter.get('/available', BoxController.getAvailableBoxes)

boxRouter.get('/searchid/:id', BoxController.getBoxCodeById)
