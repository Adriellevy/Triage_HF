import 'dotenv/config';
import { type Request, type Response } from 'express';
import { IPatinet, PatientsModel } from '../models/mysql/patientModel';
import { validatePartialPatient, validatePatient } from '../schemas/patientSchema';
import { verifyRefreshToken, verifyToken } from '../helpers/authhelper';
import { GeneratePatientHistoryItem } from '../helpers/patienthelper';
import {
  SendNewPatientNotifications,
  SendUpdatePatientNotifications
} from '../helpers/notificationhelper';
import { string } from 'zod';
import { format } from 'date-fns';
import {
  decryptPatientData,
  dencryptstring,
  encryptPatientData,
  encryptstring
} from '../helpers/handleEncription-Decription';
import { Patient } from '../interface/patient';
// import { ComparePatientItems } from '../helpers/patienthelper';
export class PatientController {
  // static async getAllPatients(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const users = await PatientsModel.getAllPatients();
  //     return res.json(users);
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Something goes wrong' });
  //   }
  // }

  static async createNewPatient(req: Request, res: Response): Promise<Response> {
    const result = validatePatient(req.body);

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    const userID = decoded.id;
    // const DatabaseToken = await verifyRefreshToken(token, userID);
    // if (!DatabaseToken) res.status(401).json({ error: 'Token no proporcionado' });

    if (!result.success) {
      return res.status(500).json({ errors: result.error.errors });
    }

    try {
      const newPatientId: string = await PatientsModel.createNewPatient({
        data: encryptPatientData(result.data as unknown as Patient)
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
      if (User) return res.json(decryptPatientData(User));
      return res.status(404).json({ message: 'Patient not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getPatientByName(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.params;
      const User = await PatientsModel.getPatientsByName(encryptstring(name.toString()));
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
    // const DatabaseToken = await verifyRefreshToken(token, userID);
    // if (!DatabaseToken) res.status(401).json({ error: 'Token no proporcionado' });

    try {
      const { id } = req.params;
      const { Merge_Complete } = req.body; // Destructurar Merge_complete del cuerpo del request
      console.log('Body mensaje:\n ', req.body);
      console.log('\nHay merge complete?:', Merge_Complete);
      const UserAntiguo = await PatientsModel.getPatientById({ id });
      //UserAntiguo = decryptPatientData(UserAntiguo as Patient) as IPatinet;
      if (!UserAntiguo) return res.status(404).json({ message: 'Patient not found' });
      const UserNuevo: Patient = {
        ...result.data,
        patient_id: UserAntiguo.patient_id
      } as Patient;

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
      console.log('userAntiguo: ', UserAntiguo);
      const cambios = GeneratePatientHistoryItem(
        encryptPatientData(UserNuevo),
        UserAntiguo,
        tiempoActual,
        userID
      );

      for (const item of cambios) {
        await PatientsModel.AddUpdateHistory({ data: item });
      }

      const updatedUser = await PatientsModel.updatePatient({
        id,
        data: encryptPatientData(result.data as Patient) as Patient
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
      const decryptedHistory = UpdateHistory.map((item) => {
        if (
          item.patient_updated_column === 'patient_name' ||
          item.patient_updated_column === 'patient_age'
        ) {
          return {
            ...item,
            patient_old_value: dencryptstring(item.patient_old_value),
            patient_new_value: dencryptstring(item.patient_new_value)
          };
        }
        return item;
      });
      return res.json(decryptedHistory);
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
      const decryptedPatients = paginatedPatients.map((patient) => {
        try {
          return decryptPatientData(patient);
        } catch (decryptError) {
          console.error('Error desencriptando datos del paciente:', decryptError);
          // Devuelve el paciente original sin desencriptar si hay un error
          return patient;
        }
      });

      return res.json(decryptedPatients);
    } catch (error) {
      console.log('Error: ', error);
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getUsersByFilter(req: Request, res: Response): Promise<Response> {
    try {
      const { PatientsOfThisUser, Filters } = req.body;
      console.log('patients of this user', PatientsOfThisUser);
      console.log('body:', req.body);
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const tokendecoded = verifyToken(token);
      const userID = tokendecoded.id;
      if (!userID) {
        return res.status(404).json({ message: 'UserId is not correct format' });
      }
      if (!Array.isArray(Filters)) {
        console.log('Error en como recibo los filtros');
        return res.status(404).json({ message: 'Filters should be an array' });
      }

      let patients;
      // Si PatientsOfThisUser es verdadero, buscar pacientes asignados a este usuario (doctor o enfermero)
      if (PatientsOfThisUser) {
        console.log('Filtros', Filters);
        patients = await PatientsModel.getPatientsByUserAndStatus(userID, Filters);
      } else {
        patients = await PatientsModel.getPatientsByStatus(Filters);
      }

      // Desencriptar todos los pacientes
      const decryptedPatients = patients.map((patient) => decryptPatientData(patient));

      // Retornar la respuesta con los pacientes desencriptados
      return res.json(decryptedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
  static async getPatientsByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { user_id } = req.params; 
      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
      }
  
      const token = req.headers.authorization?.split(' ')[1]; 

      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const tokendecoded = verifyToken(token);
      const userID = tokendecoded.id;

      if (!userID) {
        return res.status(404).json({ message: 'user_id is not correct format' });
      }

      const patients = await PatientsModel.getPatientsByUserID(user_id);
      const decryptedPatients = patients.map((patient) => decryptPatientData(patient));

      return res.json(decryptedPatients);
    } catch (error) {
      console.error('Error fetching patients by user ID:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  static async getUsersByDate(req: Request, res: Response): Promise<Response> {
    try {
      const { StartDate, EndDate } = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const tokendecoded = verifyToken(token);
      const userID = tokendecoded.id;
      if (!userID) {
        return res.status(404).json({ message: 'UserId is not correct format' });
      }

      // Verificar si las fechas son válidas
      const startDateValid = !isNaN(Date.parse(StartDate));
      const endDateValid = !isNaN(Date.parse(EndDate));

      if (!startDateValid || !endDateValid) {
        console.log('No pasaron las fechas');
        return res.status(400).json({ message: 'Las fechas proporcionadas no son válidas' });
      }

      const formattedStartDate = format(new Date(StartDate), 'yyyy-MM-dd 00:00:00');

      const formattedEndDate = format(new Date(EndDate), 'yyyy-MM-dd 23:59:59');
      const patients = await PatientsModel.getPatientsByEntryDate(
        formattedStartDate,
        formattedEndDate
      );
      // Desencriptar todos los pacientes
      const decryptedPatients = patients.map((patient) => decryptPatientData(patient));

      // Retornar la respuesta con los pacientes desencriptados
      return res.json(decryptedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
}
