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

      const UserAntiguo = await PatientsModel.getPatientById({ id });

      if (!UserAntiguo) return res.status(404).json({ message: 'Patient not found' });

      const UserNuevo = {
        ...result.data,
        patient_id: UserAntiguo.patient_id
      };

      const tiempoActual = new Date();

      const cambios = GeneratePatientHistoryItem(UserNuevo, UserAntiguo, tiempoActual, userID);

      console.log(cambios);

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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      SendUpdatePatientNotifications(req, updatedUser, userID);
      return res.json(UserAntiguo);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  /*

  static async updatePatient(req: Request, res: Response): Promise<Response> {
    const result = validatePartialPatient(req.body);
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as ExtendedJwtPayload;
    const userID = decoded.id;

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    try {
      const { id } = req.params;

      const [UserAntiguo] = await PatientsModel.getPatientById({ id });

      if (result.data.patient_age) {
        result.data.patient_age = new Date(result.data.patient_age);
      }
      if (result.data.patient_triage_time) {
        result.data.patient_triage_time = new Date(result.data.patient_triage_time);
      }
      if (result.data.patient_entry_time) {
        result.data.patient_entry_time = new Date(result.data.patient_entry_time);
      }
      if (result.data.patient_exit_time) {
        result.data.patient_exit_time = new Date(result.data.patient_exit_time);
      }
      const UserNuevo = result.data;
      const cambios = [];
      const tiempoActual = new Date();

      console.log(UserNuevo);

      // eslint-disable-next-line no-restricted-syntax
      for (const key in UserNuevo) {
        if (key === 'patient_exit_time') {
          
            cambios.push({
            patient_id: UserAntiguo.patient_id,
            updated_column: key,
            old_value: 'null',
            new_value: UserNuevo[key],
            update_date: tiempoActual,
            user_id: userID,
          })
          
        } else if (
          key === 'patient_triage_time' ||
          key === 'patient_entry_time' ||
          key === 'patient_age'
        ) {
          if (UserAntiguo[key].getTime() !== UserNuevo[key].getTime()) {
            cambios.push({
              patient_id: UserAntiguo.patient_id,
              updated_column: key,
              old_value: UserAntiguo[key],
              new_value: UserNuevo[key],
              update_date: tiempoActual,
              user_id: userID
            });
          }
        } else if (key === 'patient_isolated') {
          if (
            // eslint-disable-next-line no-prototype-builtins
            UserAntiguo.hasOwnProperty(key) &&
            Boolean(UserAntiguo[key]) !== Boolean(UserNuevo[key])
          ) {
            cambios.push({
              patient_id: UserAntiguo.patient_id,
              updated_column: key,
              old_value: UserAntiguo[key],
              new_value: UserNuevo[key],
              update_date: tiempoActual,
              user_id: userID
            });
          }
        } else if (
          // eslint-disable-next-line no-prototype-builtins
          UserAntiguo.hasOwnProperty(key) &&
          UserAntiguo[key] !== UserNuevo[key]
        ) {
          cambios.push({
            patient_id: UserAntiguo.patient_id,
            updated_column: key,
            old_value: UserAntiguo[key],
            new_value: UserNuevo[key],
            update_date: tiempoActual,
            user_id: userID
          });
        }
      }
      console.log(cambios);

      // eslint-disable-next-line no-restricted-syntax
      for (const item of cambios) {
        // eslint-disable-next-line no-await-in-loop
        await PatientsModel.AddUpdateHistory({ data: item });
      }

      const updatedUser = await PatientsModel.updatePatient({
        id,
        data: result.data
      });

      if (updatedUser === false) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const { io } = req;
      io?.emit('update', {
        message: 'Updated patient'
      });
      try {
        const [Patient] = await PatientsModel.getPatientById({ id });

        if (userID !== result.data.doctor_id) {
          io?.emit(`${result.data.doctor_id}`, {
            message: 'Updated patient',
            patient: {
              patient_name: Patient.patient_name,
              patient_id: id
            }
          });
        }

        if (userID !== result.data.nurse_id) {
          io?.emit(`${result.data.nurse_id}`, {
            message: 'Updated patient',
            patient: {
              patient_name: Patient.patient_name,
              patient_id: id
            }
          });
        }

        io?.emit('update', {
          message: 'Box Update'
        });
      } catch (e) {
        console.log(e);
      }
      return res.json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  */

  static async getPatientUpdateHistory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const UpdateHistory = await PatientsModel.getPatientUpdateHistory({ id });
      return res.json(UpdateHistory);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }
}
