/* eslint-disable camelcase */
import { connection } from '../../db.js'

export class UserModel {
  static async getUserByUserName(user_name) {
    const usersQuery = `
    SELECT * FROM User WHERE user_name = ?;
  `
    const [user] = await connection.query(usersQuery, [user_name])
    if (user.length === 0) return false
    return user
  }

  static async createNewUser(data) {
    // TODO
    const { user_name, user_email, hash_password } = data
  }
}
