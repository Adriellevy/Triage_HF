import 'dotenv/config';
import { json, type Request, type Response } from 'express';
import { PatientsModel } from '../models/mysql/patientModel';
import { verifyToken } from '../helpers/authhelper';
import { format } from 'date-fns';
import { decryptPatientData } from '../helpers/handleEncription-Decription';
import { queryModel } from '../models/mysql/queryModel';

export class queryController {
  static async getUsersByQuery(req: Request, res: Response): Promise<Response> {
    try {
      console.log('llego la req');
      const { query } = req.params;

      const token = req.headers.authorization?.split(' ')[1];
      if (!token || token !== process.env.PYTHONSERVER) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }
      console.log('query:', query);

      const patients = await queryModel.getPatientsByQuery(query);
      // Desencriptar todos los pacientes
      const decryptedPatients = patients.map((patient) => decryptPatientData(patient));
      console.log('pacientes devueltos:', JSON.stringify(decryptedPatients[1]));
      // Retornar la respuesta con los pacientes desencriptados
      return res.json(patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
