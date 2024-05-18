import 'dotenv/config';
import jwt, { type Secret } from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { compare } from '../helpers/handleBcrypt';
import { UserModel } from '../models/mysql/userModel';
import { validatePartialUser } from '../schemas/userSchema';

export class AuthController {
  static async login(req: Request, res: Response): Promise<Response> {
    const result = validatePartialUser(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    try {
      const { user_name, user_password } = result.data;
      if (!user_password || !user_name) {
        return res.status(401).json({ message: 'Password' });
      }
      const UserData = await UserModel.getUserByUserName(user_name);
      if (!UserData?.user_password) {
        return res.status(401).json({ message: 'User not found' });
      }
      const checkPassword = await compare(user_password, UserData.user_password);
      if (checkPassword) {
        const userForToken = {
          id: UserData.user_id,
          name: user_name
        };
        const token = jwt.sign(userForToken, process.env.JWT_SECRET as Secret);
        return res.send({
          name: user_name,
          token
        });
      }
      return res.status(401).json({ message: 'Invalid password' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }
  /* 
  static async register(req: Request, res: Response): Promise<Response> {
    const result = validateUser(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { user_name, user_email, user_password, user_password_confirmation, user_rol } =
      result.data;
    const hash_password = await encrypt(user_password);
    if (user_password === user_password_confirmation) {
      // eslint-disable-next-line object-curly-newline
      const data = { user_name, user_email, hash_password, user_rol };
      try {
        const newUser = await UserModel.createNewUser(data);
        return res.status(201).json(newUser);
      } catch (error) {
        return res.status(500).json({ message: 'Something goes wrong' });
      }
    }
    return res.status(500).json({ message: 'Something goes wrong' });
  }
  */
}
