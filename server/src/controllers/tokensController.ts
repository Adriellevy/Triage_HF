import { type Request, type Response } from 'express';
import TokensModel from '../models/mysql/TokensModel';
import jwt, { type Secret } from 'jsonwebtoken';

class TokensController {
  static async createToken(
    req: Request,
    res: Response,
    expiration_hours: number
  ): Promise<Response> {
    try {
      const { userId }: { userId: string } = req.body; // Aseguramos el tipado de userId
      const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET as Secret, {
        expiresIn: '' + expiration_hours + 'h'
      });
      const tokenData = await TokensModel.addToken(userId, refreshToken);
      return res.status(201).json(tokenData);
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear el token.' });
    }
  }

  static async deleteToken(req: Request, res: Response): Promise<Response> {
    try {
      const { tokenId } = req.params; // Tipado automático de params
      await TokensModel.deleteToken(tokenId);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar el token.' });
    }
  }

  static async updateToken(
    req: Request,
    res: Response,
    expiration_hours: number
  ): Promise<Response> {
    try {
      const { tokenId } = req.params;
      const { userId }: { userId: string } = req.body; // Tipado explícito de `userId`
      const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET as Secret, {
        expiresIn: '' + expiration_hours + 'h'
      });

      await TokensModel.updateToken(tokenId, newRefreshToken);
      return res.status(200).json({ tokenId, newRefreshToken });
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar el token.' });
    }
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
