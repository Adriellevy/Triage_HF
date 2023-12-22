/* eslint-disable camelcase */
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { compare, encrypt } from '../helpers/handleBcrypt.js'
import { UserModel } from '../models/mysql/userModel.js'
import { validateUser, validatePartialUser } from '../schemas/userSchema.js'

export class AuthController {
  static async login(req, res) {
    const result = validatePartialUser(req.body)
    const { user_name, user_password } = result.data
    try {
      const UserData = await UserModel.getUserByUserName(user_name)
      const checkPassword = await compare(user_password, UserData.user_password)
      if (checkPassword) {
        const userForToken = {
          id: UserData.user_id,
          name: user_name,
        }
        const token = jwt.sign(userForToken, process.env.JWT_SECRET)
        return res.send({
          name: user_name,
          token,
        })
      }
      return res.status(401).json({ message: 'Invalid password' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async register(req, res) {
    const result = validateUser(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const {
      user_name,
      user_email,
      user_password,
      user_password_confirmation,
      user_rol,
    } = result.data
    const hash_password = await encrypt(user_password)
    if (user_password === user_password_confirmation) {
      // eslint-disable-next-line object-curly-newline
      const data = { user_name, user_email, hash_password, user_rol }
      try {
        const newUser = await UserModel.createNewUser(data)
        return res.status(201).json(newUser)
      } catch (error) {
        return res.status(500).json({ message: 'Something goes wrong' })
      }
    }
    return res.status(500).json({ message: 'Something goes wrong' })
  }
}
