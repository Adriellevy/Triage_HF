import { BoxModel, type IBox } from '../models/mysql/boxModel';
import { type Request, type Response } from 'express';
import { validateBox } from '../schemas/boxSchema';
import { verifyToken } from '../helpers/authhelper';
import { UserModel } from '../models/mysql/userModel';
import { type User, UserRole } from '../interface/user';
import { SendNewBoxNotifications } from '../helpers/notificationhelper';
import 'dotenv/config';
export class BoxController {
  static async getAllBoxes(req: Request, res: Response): Promise<Response> {
    try {
      const boxes = await BoxModel.getAllBoxes();
      if (boxes) return res.json(boxes);
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
      if (boxes) return res.json(boxes);
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
    const userID = decoded.id;
    const userType_verificado = (await UserModel.getUserByID({ id: userID }))?.user_type;
    if (userType_verificado !== UserRole.HOSPITAL)
      return res.status(401).json({ error: 'Usuario con acceso denegado' });

    console.log('user Id Verificado: ', userID);
    // Verificar el token de autorización

    // Verificar si la validación del box fue exitosa
    if (!result.success) {
      return res.status(500).json({ errors: result.error.errors });
    }

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

  // static async createNewBox(req: Request, res: Response): Promise<Response> {
  //   // Separar box y userId del body
  //   const { userId, ...boxData } = req.body;

  //   // Validar el box
  //   const result = validateBox(boxData);
  //   let userId_verificado: string | undefined = '';
  //   // validar userId
  //   if (userId.toString() as string) {
  //     const decoded = jwt.verify(
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //       userId.toString(),
  //       process.env.JWT_SECRET as Secret
  //     ) as ExtendedJwtPayload;
  //     const userID = decoded.id;
  //     userId_verificado = (await UserModel.getUserByID({ id: userID }))?.user_id;
  //     console.log('user Id Verificado: ', userId_verificado);
  //   } // Verificar el token de autorización
  //   const token = req.headers.authorization?.split(' ')[1];

  //   if (!token) {
  //     return res.status(401).json({ error: 'Token no proporcionado' });
  //   }

  //   const decoded = verifyToken(token);
  //   console.log('Decoded: ', decoded);
  //   // Verificar si la validación del box fue exitosa
  //   if (!result.success) {
  //     return res.status(500).json({ errors: result.error.errors });
  //   }

  //   try {
  //     // Crear un nuevo box
  //     const newBox: IBox | null = await BoxModel.addBox(result.data as IBox);

  //     // Obtener usuarios con rol 'HOSPITAL'
  //     const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);

  //     if (newBox && Users && userId_verificado) {
  //       // Enviar notificaciones sobre el nuevo box
  //       SendNewBoxNotifications(req, newBox, Users, userId_verificado);
  //       return res.status(201).json({
  //         message: 'New box created successfully',
  //         boxId: newBox.box_id,
  //         createdBy: userId // Opcional: puedes devolver el userId para indicar quién creó el box
  //       });
  //     }

  //     return res.status(500).json({ message: 'Failed to create a new box' });
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Something went wrong' });
  //   }
  // }

  // static async updateBox(req: Request, res: Response): Promise<Response> {
  //   const result = validatePartialBox(req.body);

  //   if (!result.success) {
  //     return res.status(500).json({ errors: result.error.errors });
  //   }

  //   const token = req.headers.authorization?.split(' ')[1];

  //   if (!token) {
  //     return res.status(401).json({ error: 'Token no proporcionado' });
  //   }

  //   const decoded = verifyToken(token);
  //   const userID = decoded.id;

  //   try {
  //     const { id } = req.params;
  //     const oldBox = await BoxModel.getBoxCodeById(id);

  //     if (!oldBox) return res.status(404).json({ message: 'Box not found' });

  //     const updatedBox = {
  //       ...result.data,
  //       box_id: oldBox.box_id
  //     };

  //     const wasUpdated = await BoxModel.updateBox(id, result.data as IBox);

  //     if (!wasUpdated) {
  //       return res.status(404).json({ message: 'Box not found' });
  //     }

  //     const finalBox = await BoxModel.getBoxCodeById(id);

  //     if (!finalBox) return res.status(404).json({ message: 'Box not found' });

  //     const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);

  //     SendUpdateBoxNotifications(req, finalBox, Users);
  //     return res.json(finalBox);
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Something goes wrong' });
  //   }
  // }
}
