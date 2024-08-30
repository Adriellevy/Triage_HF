import 'dotenv/config';
import { type Request, type Response } from 'express';
import { UserModel } from '../models/mysql/userModel';
import { verifyToken } from '../helpers/authhelper';
import { validatePartialUpdateUser, validateUser } from '../schemas/userSchema';
import { IUser } from '../models/mysql/patientModel';
import { User, UserRole } from '../interface/user';
import { SendUpdatedUserNotifications } from '../helpers/notificationhelper';

export class UserController {
  static async getUserIdByToken(req: Request, res: Response): Promise<Response> {
    const token: string = req.body.token;
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    try {
      const decoded = verifyToken(token);
      return res.json(decoded.id);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const tokendecoded = verifyToken(token.toString());
        if (!tokendecoded) {
          return res.status(401).json({ error: 'Token no proporcionado' });
        }
      }
      const User = await UserModel.getUserByID({ id });
      if (User) return res.json(User);
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getAllDoctors(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserModel.getAllDoctors();
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const tokendecoded = verifyToken(token.toString());
        if (!tokendecoded) {
          return res.status(401).json({ error: 'Token no proporcionado' });
        }
      }
      const newusers = users?.map(({ user_email, user_password, ...rest }) => rest);
      return res.json(newusers);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getAllNurse(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserModel.getAllNurse();
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const tokendecoded = verifyToken(token.toString());
        if (!tokendecoded) {
          return res.status(401).json({ error: 'Token no proporcionado' });
        }
      }
      const newusers = users?.map(({ user_email, user_password, ...rest }) => rest);
      return res.json(newusers);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await UserModel.getAllUsers();
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const tokendecoded = verifyToken(token.toString());
        if (!tokendecoded) {
          return res.status(401).json({ error: 'Token no proporcionado' });
        }
      }
      const newusers = users?.map(({ user_email, user_password, ...rest }) => rest);
      return res.json(newusers);
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async createNewUser(req: Request, res: Response): Promise<Response> {
    const { ...userData } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    const result = validatePartialUpdateUser(userData);

    if (!result.success) {
      return res.status(500).json({ errors: result.error.errors });
    }

    console.log('Informacion que llego:', userData);
    try {
      const newUser = await UserModel.addUser(userData as User);
      if (newUser) {
        // Obtener usuarios con rol 'HOSPITAL'
        const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);
        SendUpdatedUserNotifications(req, newUser, Users, token);
        return res.status(201).json({
          message: 'Nuevo usuario creado exitosamente',
          userId: newUser.user_id,
          createdBy: decoded.id
        });
      }
      return res.status(500).json({ message: 'Error al crear el usuario' });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  }

  // Actualizar un usuario existente
  static async updateUser(req: Request, res: Response): Promise<Response> {
    const { id: userId } = req.params;
    const { ...userData } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    const result = validatePartialUpdateUser(userData);
    if (!result.success) {
      return res.status(500).json({ errors: result.error.errors });
    }

    try {
      const existingUser = await UserModel.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      const updatedUser = await UserModel.updateUser(userId, result.data as User);

      if (updatedUser) {
        // Obtener usuarios con rol 'HOSPITAL'
        const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);
        SendUpdatedUserNotifications(req, existingUser, Users, token);
        return res.status(200).json({
          message: 'Usuario actualizado exitosamente',
          userId: updatedUser.user_id,
          updatedBy: decoded.id
        });
      }

      return res.status(500).json({ message: 'Error al actualizar el usuario' });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  }

  // Eliminar un usuario
  static async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id: userId } = req.params;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);

    try {
      const existingUser = await UserModel.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const deleted = await UserModel.deleteUser(userId);
      if (deleted) {
        return res.status(200).json({
          message: 'Usuario eliminado correctamente',
          userId,
          deletedBy: decoded.id
        });
      }

      return res.status(500).json({ message: 'Error al eliminar el usuario' });
    } catch (error) {
      return res.status(500).json({ message: 'Algo salió mal' });
    }
  }
  // static async getAllHospitalUser(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const users = await UserModel.getUsersByRole(UserRole.HOSPITAL);
  //     const newusers = users?.map(({ user_email, user_password, ...rest }) => rest);
  //     return res.json(newusers);
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Something goes wrong' });
  //   }
  // }
}
