/* eslint-disable camelcase */
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { UserModel } from '../models/mysql/userModel.js'

export class UserController {
  static async getUserIdByToken(req, res) {
    // eslint-disable-next-line prefer-destructuring
    const token = req.body.token
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return res.json(decoded.id)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params
      const User = await UserModel.getUserByID({ id })
      if (User) return res.json(User)
      return res.status(404).json({ message: 'User not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

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
