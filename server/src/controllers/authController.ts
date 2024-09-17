import 'dotenv/config';
import { type Request, type Response } from 'express';
import { compare } from '../helpers/handleBcrypt';
import { UserModel } from '../models/mysql/userModel';
import { signToken, signTokenWithExpiration } from '../helpers/authhelper';
import { validateAuth } from '../schemas/authSchema';
import TokensModel from '../models/mysql/TokensModel';

export class AuthController {
  static async login(req: Request, res: Response): Promise<Response> {
    const result = validateAuth(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    try {
      const { user_name, user_password } = result.data;
      const UserData = await UserModel.getUserByUserName(user_name);

      if (!UserData?.user_password) {
        return res.status(401).json({ message: 'User not found' });
      }

      const checkPassword = await compare(user_password, UserData.user_password);
      if (!checkPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Crear token de acceso
      const userForToken = {
        id: UserData.user_id,
        name: user_name
      };
      const token = signTokenWithExpiration(userForToken, 10 / 60); //TODO CAMBIAR TIEMPO LOGIN

      // Verificar si existe un refresh token en la base de datos
      const existingToken = await TokensModel.findTokenByUserId(UserData.user_id);
      const RefreshToken = signTokenWithExpiration(userForToken, 1 / 3600); // Token de refresco //TODO CAMBIAR TIEMPO REFRESH

      if (existingToken) {
        // Si existe, actualiza el refresh token
        const updated = await TokensModel.updateToken(existingToken.token_id, RefreshToken);
        if (!updated) {
          return res.status(500).json({ message: 'Failed to update refresh token' });
        }
      } else {
        // Si no existe, crea uno nuevo
        const added = await TokensModel.addToken(UserData.user_id, RefreshToken);
        if (!added) {
          return res.status(500).json({ message: 'Failed to create refresh token' });
        }
      }

      // Enviar respuesta con token de acceso y nombre de usuario
      return res.send({
        name: user_name,
        token
      });
    } catch (error) {
      console.error('Login error:', error); // Log para depuración
      return res.status(500).json({ message: 'Something went wrong during login' });
    }
  }
}
