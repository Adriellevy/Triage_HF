/* eslint-disable camelcase */
import { UserModel } from '../models/mysql/userModel.js'

export class UserController {
  static async getAllDoctors(req, res) {
    try {
      const users = await UserModel.getAllDoctors()
      const newusers = users.map(
        ({ user_email, user_password, ...rest }) => rest,
      )
      return res.json(newusers)
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getAllNurse(req, res) {
    try {
      const users = await UserModel.getAllNurse()
      const newusers = users.map(
        ({ user_email, user_password, ...rest }) => rest,
      )
      return res.json(newusers)
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }
}
