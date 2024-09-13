import 'dotenv/config';
import { type Request, type Response } from 'express';
import { UserModel } from '../models/mysql/userModel';
import { validateRefresh } from '../schemas/authSchema';
import { verifyRefreshToken, signTokenWithExpiration } from '../helpers/authhelper';
export class refreshToken {
  static async handleRefreshToken(req: Request, res: Response): Promise<Response> {
    const cookie = req.cookies;
    if (!cookie.jwt) return res.status(401).json({ error: 'No token provided' });

    const refreshToken: string = cookie.jwt;

    // Validamos el esquema de refresh
    const result = validateRefresh(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    try {
      const { user_name } = result.data;
      const userData = await UserModel.getUserByUserName(user_name);

      if (!userData?.user_password) {
        return res.status(401).json({ message: 'User not found' });
      }
      // Crear token de acceso
      const userForToken = {
        id: userData.user_id,
        name: user_name
      };
      // Usamos el método verifyToken de TokensController para verificar el token
      const tokenVerification = await verifyRefreshToken(refreshToken);
      if (!tokenVerification) return res.status(401).json({ message: 'tokenVerification err' }); // Si hubo un error en la verificación, la respuesta ya se envió
      // Generamos un nuevo access token usando los datos del usuario verificados
      const newAccessToken = signTokenWithExpiration(userForToken, 1); // Tiempo de expiración ajustado

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(500).json({ message: 'Error processing refresh token' });
    }
  }
}
