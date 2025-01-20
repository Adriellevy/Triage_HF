import 'dotenv/config';
import { type Request, type Response } from 'express';
import { UserModel } from '../models/mysql/userModel';
import { IsValidToken, verifyToken } from '../helpers/authhelper';
import { validatePartialUpdateUser, validateUser } from '../schemas/userSchema';
import { User, UserRole } from '../interface/user';
import { SendUpdatedUserNotifications } from '../helpers/notificationhelper';
import { encrypt } from '../helpers/handleBcrypt';
import { RowDataPacket } from 'mysql2';
import { Patient } from '../interface/patient';
import TokensModel from '../models/mysql/TokensModel';

export interface IUser extends Patient, RowDataPacket {}
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
      let users:User[] = [];
      if(req.query.withPatients && req.query.withPatients === 'true'){
        users = await UserModel.getAllDoctorsWithPatients() || []
      }else{
        users = await UserModel.getAllDoctors() || [];
      }
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
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllNurse(req: Request, res: Response): Promise<Response> {
    try {
      let users:User[] = [];
      if(req.query.withPatients && req.query.withPatients === 'true'){
        users = await UserModel.getAllNursesWithPatients() || []
      }else{
        users = await UserModel.getAllNurse() || [];
      }
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
      // Verificar si hay un token en la solicitud
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const tokendecoded = verifyToken(token);
        if (!tokendecoded) {
          return res.status(401).json({ error: 'Token no proporcionado o inválido' });
        }
      }

      // Obtener todos los usuarios
      const users = await UserModel.getAllUsers();

      // Obtener los tokens asociados a los usuarios
      const tokens = await TokensModel.getTokensForUsers();

      // Crear un diccionario para almacenar el estado del token de cada usuario
      const tokenMap = new Map<string, boolean>();

      // Verificar cada token
      tokens.forEach(({ user_id, refresh_token }) => {
        try {
          const decodedToken = IsValidToken(refresh_token); // Verificamos si el token es válido
          tokenMap.set(user_id, !!decodedToken); // Si es válido, el estado es 'true', si no, 'false'
        } catch (error) {
          // Si el token es inválido o ha expirado, el estado es 'false'
          tokenMap.set(user_id, false);
        }
      });

      // Filtrar la información sensible y agregar el campo state basado en la validez del token
      const newUsers = users.map(({ user_id, user_email, user_password, ...rest }) => {
        const state = tokenMap.has(user_id) ? tokenMap.get(user_id) : false; // Si hay token, lo asigna, si no, 'false'
        return { ...rest, user_id, state }; // Aseguramos que user_id esté presente
      });

      return res.json(newUsers);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  static async createNewUser(req: Request, res: Response): Promise<Response> {
    const { ...userData } = req.body;

    console.log('Informacion que llego:', userData);
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    const result = validatePartialUpdateUser(userData);

    if (!result.success) {
      // Respuesta enviada, se detiene la ejecución
      return res.status(500).json({ errors: result.error.errors });
    }

    try {
      const { user_password } = result.data;
      if (user_password) {
        const hash_password = await encrypt(user_password);
        userData.user_password = hash_password;
        console.log('Hash pass:', hash_password);
        console.log('userData.user_password:', userData.user_password);
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
      }
      // Respuesta de error si no se pudo crear el usuario
      return res.status(500).json({ message: 'Error al crear el usuario' });
    } catch (error) {
      // Manejo de errores generales
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
      if (result.data.user_password) {
        result.data.user_password = await encrypt(result.data.user_password);
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
    const userToken = await UserModel.getUserById(decoded.id);
    if(userToken?.user_type !== UserRole.HOSPITAL)
      return res.status(403).json({message: 'No tienes permisos para eliminar este usuario'});

    try {
      const existingUser = await UserModel.getUserById(userId);
      
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }


      const deleted = await UserModel.deleteUser(userId);
      if (deleted) {
        const Users: User[] = await UserModel.getUsersByRole(UserRole.HOSPITAL);
        SendUpdatedUserNotifications(req, existingUser, Users, token);
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
