import { compare, encrypt } from '../helpers/handleBcrypt.js'

import { UserModel } from '../models/mysql/userModel.js'

export class AuthController {
  static async login(req, res) {
    // TODO:
    try {
      const { user, password } = req.body
      const UserData = await UserModel.getUser(user)
      const checkPassword = await compare(password, UserData.password)
      if (checkPassword) {
        // eslint-disable-next-line no-console
        console.log(user)
        return res.status(500).json({ message: 'TODO' })
      }
      return res.status(500).json({ message: 'TODO' })
    } catch (error) {
      return res.status(500).json({ message: 'TODO' })
    }
  }

  static async register(req, res) {
    // TODO
    const { user, password } = req.body
    const hashpassword = await encrypt(password)
    const data = { user, hashpassword }
    await UserModel.addNewuSER(data)
  }
}
