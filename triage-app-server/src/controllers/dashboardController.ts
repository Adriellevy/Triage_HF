import 'dotenv/config';
import { type Request, type Response } from 'express';
import { PatientsModel } from '../models/mysql/patientModel';
import { BoxModel } from '../models/mysql/boxModel';

export class DashboardController {
  static async getDashboardData(req: Request, res: Response): Promise<Response> {
    try {
      const AvailableBoxesCount = await BoxModel.getAvailableBoxesCount();
      const PatientsCount = await PatientsModel.getPatientsCount();
      const OutsidePatientsCount = await PatientsModel.getOutsidePatientsCount();
      const TriageIIPatientsCount = await PatientsModel.getTriageIIPatientsCount();
      return res.status(200).json({
        PatientsCount,
        OutsidePatientsCount,
        TriageIIPatientsCount,
        AvailableBoxesCount,
        message: 'Dashboard data retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }
}
