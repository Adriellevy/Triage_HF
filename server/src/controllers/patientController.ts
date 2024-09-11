import 'dotenv/config';
import { type Request, type Response } from 'express';
import { PatientsModel } from '../models/mysql/patientModel';
import { validatePartialPatient, validatePatient } from '../schemas/patientSchema';
import { verifyToken } from '../helpers/authhelper';
import { GeneratePatientHistoryItem } from '../helpers/patienthelper';
import {
  SendNewPatientNotifications,
  SendUpdatePatientNotifications
} from '../helpers/notificationhelper';
import { string } from 'zod';
// import { ComparePatientItems } from '../helpers/patienthelper';
export class PatientController {
  static async getAllPatients(req: Request, res: Response): Promise<Response> {
    try {
      const users = await PatientsModel.getAllPatients();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async createNewPatient(req: Request, res: Response): Promise<Response> {
    const result = validatePatient(req.body);

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    const userID = decoded.id;

    if (!result.success) {
      return res.status(500).json({ errors: result.error.errors });
    }

    try {
      const newPatientId: string = await PatientsModel.createNewPatient({
        data: result.data
      });
      const newPatient = {
        ...result.data,
        patient_id: newPatientId
      };
      if (newPatientId) {
        SendNewPatientNotifications(req, newPatient, userID);
        return res.status(201).json({
          message: 'New patient created successfully',
          patientId: newPatientId
        });
      }
      return res.status(500).json({ message: 'Failed to create a new patient' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  static async getPatientById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const User = await PatientsModel.getPatientById({ id });
      if (User) return res.json(User);
      return res.status(404).json({ message: 'Patient not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getPatientByName(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.params;
      const User = await PatientsModel.getPatientsByName(name.toString());
      if (User) return res.json(User);
      return res.status(404).json({ message: 'Patient not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async updatePatient(req: Request, res: Response): Promise<Response> {
    const result = validatePartialPatient(req.body);

    if (!result.success) {
      return res.status(500);
      // return res.status(500).json({ error: JSON.parse(result.error) });
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const tokendecoded = verifyToken(token);
    const userID = tokendecoded.id;

    try {
      const { id } = req.params;
      const { Merge_Complete } = req.body; // Destructurar Merge_complete del cuerpo del request
      console.log('Body mensaje:\n ', req.body);
      console.log('\nHay merge complete?:', Merge_Complete);
      const UserAntiguo = await PatientsModel.getPatientById({ id });

      if (!UserAntiguo) return res.status(404).json({ message: 'Patient not found' });

      const UserNuevo = {
        ...result.data,
        patient_id: UserAntiguo.patient_id
      };

      // Si se resulve el merge se ignora el codigo
      if (!Merge_Complete) {
        // Solo verificar el conflicto si Merge_complete no está presente o es falso
        const updateHistory = await PatientsModel.getLastPatientUpdateHistory({ id });

        if (updateHistory.length > 0) {
          const lastUpdate = updateHistory[0];
          const lastUpdatedDateStr = lastUpdate.patient_updated_date;
          const currentUpdateDateStr = result.data.patient_triage_time;

          // Check if the date strings are defined and not null
          if (lastUpdatedDateStr && currentUpdateDateStr) {
            const lastUpdatedAt = new Date(lastUpdatedDateStr);
            const currentUpdateDate = new Date(currentUpdateDateStr);

            const timeDifference = Math.abs(currentUpdateDate.getTime() - lastUpdatedAt.getTime());

            if (timeDifference <= 10000) {
              // 1000 Milisegundos = 1 segundo. Son 10 segs
              return res.status(409).json({
                message: 'Conflict detected',
                currentData: UserAntiguo,
                newData: result.data
              });
            }
          } else {
            console.error('Date strings are undefined.');
          }
        }
      }

      const tiempoActual = new Date();
      const cambios = GeneratePatientHistoryItem(UserNuevo, UserAntiguo, tiempoActual, userID);

      for (const item of cambios) {
        await PatientsModel.AddUpdateHistory({ data: item });
      }

      const updatedUser = await PatientsModel.updatePatient({
        id,
        data: result.data
      });

      if (!updatedUser) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const UserFinal = await PatientsModel.getPatientById({ id });

      if (!UserFinal) return res.status(404).json({ message: 'Patient not found' });

      SendUpdatePatientNotifications(req, UserFinal, userID);
      return res.json(UserAntiguo);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getPatientUpdateHistory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const UpdateHistory = await PatientsModel.getPatientUpdateHistory({ id });
      return res.json(UpdateHistory);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getPaginatedPatients(req: Request, res: Response): Promise<Response> {
    try {
      const { batch } = req.params;
      const pageNumber = parseInt(batch, 10);
      if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).json({ message: 'Invalid page number' });
      }
      console.log('llego a la paginacion');
      const paginatedPatients = await PatientsModel.getPaginatedPatients(pageNumber);
      return res.json(paginatedPatients);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getUsersByFilter(req: Request, res: Response): Promise<Response> {
    try {
      const { PatientsOfThisUser, Filters, userId } = req.body;
      if (typeof userId !== 'string')
        res.status(404).json({ message: 'UserId is not correct format' });

      if (!Array.isArray(Filters)) res.status(404).json({ message: 'Filters should be an array' });

      // Si PatientsOfThisUser es verdadero, buscar pacientes asignados a este usuario (doctor o enfermero)
      if (PatientsOfThisUser) {
        const patients = await PatientsModel.getPatientsByUserAndStatus(userId, Filters);
        if (patients.length > 0) {
          return res.json(patients);
        } else {
          return res
            .status(404)
            .json({ message: 'No patients found for this user with the given statuses' });
        }
      }
      // Si PatientsOfThisUser es falso, buscar pacientes por los estados especificados en Filters
      else {
        const patients = await PatientsModel.getPatientsByStatus(Filters);
        if (patients.length > 0) {
          return res.json(patients);
        } else {
          return res.status(404).json({ message: 'No patients found with the given statuses' });
        }
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
