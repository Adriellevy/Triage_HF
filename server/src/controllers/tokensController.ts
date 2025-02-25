import { type Request, type Response } from 'express';
import TokensModel from '../models/mysql/TokensModel';
import jwt from 'jsonwebtoken';
import { signTokenWithExpiration, verifyToken } from '../helpers/authhelper';

class TokensController {
  static async deleteToken(req: Request, res: Response): Promise<Response> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error('Authorization header is missing');
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token); // Tipado automático de params
      if (decoded && typeof decoded !== 'string') {
        await TokensModel.deleteTokenByUserId(decoded.id as string);
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar el token.' });
    }
  }

  static async renewToken(req: Request, res: Response): Promise<Response> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token is missing from the Authorization header');
    }

    const decoded = jwt.decode(token);

    // Verificamos que 'decoded' es un objeto y no un string
    if (decoded && typeof decoded !== 'string') {
      try {
        verifyToken(token);
      } catch (err) {
        if (err.name === 'TokenExpiredError' || err.message === 'jwt expired') {
          const decoded = jwt.decode(token);

          // Verificamos que 'decoded' es un objeto y no un string
          if (decoded && typeof decoded !== 'string') {
            // console.log('Se actualizo el token del usuario: ', decoded.name);
            // Accedemos a las propiedades del token decodificado
            const userForToken = {
              id: decoded.id, // Accedemos a 'id'
              name: decoded.name // Accedemos a 'name'
            };
            const newAccessToken = signTokenWithExpiration(userForToken, 10 / 60);
            console.log('Token devuelto al renovar');
            return res.status(200).json(newAccessToken);
          } else {
            // Manejo del caso en que 'decoded' sea un string o no sea válido
            console.log('No se pudo decodificar el token correctamente.');
            return res.status(500);
          }
        }

        return res.status(500).json({ error: 'Error al obtener el token.' });
      }
    }
    return res.status(200);
  }

  static async getTokenByUserId(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const tokenData = await TokensModel.findTokenByUserId(userId);
      if (tokenData) {
        return res.status(200).json(tokenData);
      } else {
        return res.status(404).json({ error: 'Token no encontrado.' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener el token.' });
    }
  }

  //   static async verifyToken(
  //     token: string,
  //     res: Response
  //   ): Promise<{ decoded: string | JwtPayload } | null> {
  //     return await new Promise((resolve, reject) => {
  //       jwt.verify(token, process.env.JWT_SECRET as Secret, (err: unknown | null, decoded) => {
  //         if (err) {
  //           if (err instanceof JsonWebTokenError) {
  //             return res.status(401).json({ error: 'Invalid Token' });
  //           }
  //           if (err instanceof TokenExpiredError) {
  //             return res.status(401).json({ error: 'Token Expired' });
  //           }
  //           return res.status(500).json({ error: 'Internal Server Error' });
  //         }
  //         if (!decoded) return res.status(401).json({ error: 'Invalid Token' });
  //         resolve({ decoded });
  //       });
  //     });
  //   }
}

export default TokensController;
