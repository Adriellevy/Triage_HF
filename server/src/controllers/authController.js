/* eslint-disable camelcase */
import { compare, encrypt } from '../helpers/handleBcrypt.js'
import { UserModel } from '../models/mysql/userModel.js'
import { validateUser } from '../schemas/userSchema.js'

export class AuthController {
  static async login(req, res) {
    try {
      const { user_name, user_password } = req.body
      const UserData = await UserModel.getUserByUserName(user_name)
      const checkPassword = await compare(user_password, UserData.password)
      if (checkPassword) {
        return res.status(500).json({ message: 'TODO' })
      }
      return res.status(401).json({ message: 'Invalid user or password' })
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
    } = req.body
    const hash_password = await encrypt(user_password)
    if (user_password === user_password_confirmation) {
      // eslint-disable-next-line object-curly-newline
      const data = { user_name, user_email, hash_password, user_rol }
      try {
        const newUser = await UserModel.createNewUser({ data: data.data })
        return res.status(201).json(newUser)
      } catch (error) {
        return res.status(500).json({ message: 'Something goes wrong' })
      }
    }
    return res.status(500).json({ message: 'Something goes wrong' })
  }
}
