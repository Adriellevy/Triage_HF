import { Router } from 'express'
import { SettingsController } from '../controllers/settingsController.js'

export const settingsRouter = Router()

settingsRouter.get('/', SettingsController.getSettings)
