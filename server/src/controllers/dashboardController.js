/* eslint-disable camelcase */
import 'dotenv/config'
import { PatientsModel } from '../models/mysql/patientModel.js'
import { BoxModel } from '../models/mysql/boxModel.js'

export class DashboardController {
  static async getDashboardData(req, res) {
    try {
      const AvailableBoxesCount = await BoxModel.getAvailableBoxesCount()
      const PatientsCount = await PatientsModel.getPatientsCount()
      const OutsidePatientsCount = await PatientsModel.getOutsidePatientsCount()
      // eslint-disable-next-line operator-linebreak
      const TriageIIPatientsCount =
        await PatientsModel.getTriageIIPatientsCount()
      return res.status(200).json({
        PatientsCount,
        OutsidePatientsCount,
        TriageIIPatientsCount,
        AvailableBoxesCount,
        message: 'Dashboard data retrieved successfully',
      })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }
}
