import { BoxModel, type IBox } from '../models/mysql/boxModel';
import { type Request, type Response } from 'express';
import { validateBox } from '../schemas/boxSchema';
import { verifyToken } from '../helpers/authhelper';
import { UserModel } from '../models/mysql/userModel';
import { type User, UserRole } from '../interface/user';
import {
  SendDeletedBoxNotifications,
  SendNewBoxNotifications,
  SendUpdatedBoxNotifications
} from '../helpers/notificationhelper';
import 'dotenv/config';
import { dencryptstring } from '../helpers/handleEncription-Decription';
export class BoxController {
  static async getAllBoxes(req: Request, res: Response): Promise<Response> {
    try {
      const boxes = await BoxModel.getAllBoxes();
      if (boxes) {
        // Desencripta el nombre del paciente para cada box si existe
        const decryptedBoxes = boxes.map((box) => {
          if (box.patient_name) {
            box.patient_name = dencryptstring(box.patient_name);
          }
          return box;
        });
        return res.json(decryptedBoxes);
      }
      return res.status(404).json({ message: 'boxes not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getAvailableBoxes(req: Request, res: Response): Promise<Response> {
    try {
      const boxes = await BoxModel.getAvailableBoxes();
      if (boxes) return res.json(boxes);
      return res.status(404).json({ message: 'boxes not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getBoxCodeById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const boxes = await BoxModel.getBoxCodeById(id);
      if (boxes) {
        // Desencripta el nombre del paciente para cada box si existe
        const decryptedBoxes = boxes.map((box) => {
          if (box.patient_name) {
            box.patient_name = dencryptstring(box.patient_name);
          }
          return box;
        });
        return res.json(decryptedBoxes);
      }
      return res.status(404).json({ message: 'boxes not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async createNewBox(req: Request, res: Response): Promise<Response> {
    // Separar box y userId del body
    const { ...boxData } = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    console.log('Decoded: ', decoded);

    // Validar el box
    const result = validateBox(boxData);
    if (!result.success) {
      return res.status(500).json({ errors: result.error.errors });
    }

    const userID = decoded.id;
    const userType_verificado = (await UserModel.getUserByID({ id: userID }))?.user_type; // verificar que el usuario existe
    if (userType_verificado !== UserRole.HOSPITAL)
      // verificar que el rol del usuario sea admin
      return res.status(401).json({ error: 'Usuario con acceso denegado' });

    try {
      // Crear un nuevo box
      const newBox: IBox | null = await BoxModel.addBox(result.data as IBox);

      // Obtener usuarios con rol 'HOSPITAL'
      const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);

      if (newBox && Users && userType_verificado) {
        // Enviar notificaciones sobre el nuevo box
        SendNewBoxNotifications(req, newBox, Users, token);
        return res.status(201).json({
          message: 'New box created successfully',
          boxId: newBox.box_id,
          createdBy: token // Opcional: puedes devolver el userId para indicar quién creó el box
        });
      }

      return res.status(500).json({ message: 'Failed to create a new box' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  static async updateBox(req: Request, res: Response): Promise<Response> {
    // Separar box_id y los datos del box a actualizar del body
    const { id: box_id } = req.params;
    const { ...boxData } = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    console.log('Decoded: ', decoded);

    console.log('box data:', boxData);
    // Validar el box
    const result = validateBox(boxData);
    if (!result.success) {
      return res.status(500).json({ errors: result.error.errors });
    }

    const userID = decoded.id;
    const userType_verificado = (await UserModel.getUserByID({ id: userID }))?.user_type; // verificar que el usuario existe
    if (userType_verificado !== UserRole.HOSPITAL) {
      // verificar que el rol del usuario sea HOSPITAL
      return res.status(401).json({ error: 'Usuario con acceso denegado' });
    }

    try {
      if (typeof box_id !== 'string') {
        return res.status(400).json({ error: 'box_id debe ser un string válido' });
      }

      const existingBox: IBox | null = await BoxModel.getBoxCodeById(box_id);
      if (!existingBox) {
        return res.status(404).json({ message: 'Box no encontrado' });
      }

      // Actualizar el box
      const updatedBox: IBox | null = await BoxModel.updateBox(box_id, result.data as IBox);

      // Obtener usuarios con rol 'HOSPITAL'
      const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);
      if (updatedBox && Users && userType_verificado) {
        // Enviar notificaciones sobre la actualización del box
        SendUpdatedBoxNotifications(req, updatedBox, Users, token);
        return res.status(200).json({
          message: 'Box actualizado exitosamente',
          boxId: updatedBox.box_id,
          updatedBy: token // Opcional: puedes devolver el userId para indicar quién actualizó el box
        });
      }

      return res.status(500).json({ message: 'No se pudo actualizar el box' });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  }

  static async deleteBox(req: Request, res: Response): Promise<Response> {
    const { id: box_id } = req.params; // Obtener el ID del box desde los parámetros de la ruta
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    console.log('Decoded: ', decoded);

    const userID = decoded.id;
    const userType_verificado = (await UserModel.getUserByID({ id: userID }))?.user_type;

    if (userType_verificado !== UserRole.HOSPITAL) {
      return res.status(401).json({ error: 'Usuario con acceso denegado' });
    }

    try {
      // Verificar si el box existe
      const boxExists = await BoxModel.getBoxCodeById(box_id);

      if (!boxExists) {
        return res.status(404).json({ error: 'Box no encontrado' });
      }

      // Eliminar el box
      const deletedBox = await BoxModel.deleteBox(box_id);

      if (deletedBox) {
        // Obtener usuarios con rol 'HOSPITAL'
        const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);

        // Enviar notificaciones sobre el box eliminado
        SendDeletedBoxNotifications(req, boxExists, Users, token);

        return res.status(200).json({
          message: 'Box eliminado correctamente',
          boxId: box_id,
          deletedBy: token // Opcional: puedes devolver el userId para indicar quién eliminó el box
        });
      }

      return res.status(500).json({ message: 'Error al eliminar el box' });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  }
}
