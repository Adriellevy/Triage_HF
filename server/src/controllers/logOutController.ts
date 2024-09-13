import 'dotenv/config';
import { type Request, type Response } from 'express';
import { UserModel } from '../models/mysql/userModel';
import { validateRefresh } from '../schemas/authSchema';

export class logOut {
  static async handleLogout(req: Request, res: Response): Promise<Response> {
    // En el lado del cliente eliminar tambien el accesstoken
    const cookie = req.cookies;
    if (!cookie.jwt) return res.sendStatus(204); // no hay contenido para contestar
    const refreshToken: string = cookie.jwt; // refreshtoken a ser removida

    const result = validateRefresh(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    try {
      const { user_name } = result.data;
      const UserData = await UserModel.getUserByUserName(user_name); // cambiar este metodo por uno que busque el refreshtoken en la bd

      if (!UserData) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
      }
      // delete de refresh token on the db
      return res.status(401).json({ message: 'Invalid username' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong with authTokenCotroller' });
    }
  }
}
