/* eslint-disable no-console */
/* eslint-disable camelcase */
import { connection } from '../../db.js'

export class UserModel {
  static async getUserByUserName(user_name) {
    try {
      const usersQuery = `
        SELECT * FROM Users WHERE user_name = ?;
      `
      const [[user]] = await connection.query(usersQuery, [user_name])
      if (user.length === 0) return false
      return user
    } catch (error) {
      console.error('Error en la consulta getUserByUserName:', error)
      throw error
    }
  }

  static async getUserByID({ id }) {
    try {
      const usersQuery = `
        SELECT * FROM Users WHERE user_id = ?;
      `
      const [[user]] = await connection.query(usersQuery, [id])
      if (user.length === 0) return false
      const { user_id, user_name, user_type } = user
      return { user_id, user_name, user_type }
    } catch (error) {
      console.error('Error en la consulta getUserByID:', error)
      throw error
    }
  }

  static async createNewUser(data) {
    // TODO
    const { user_name, user_email, hash_password } = data
  }

  static async getAllDoctors() {
    try {
      const usersQuery = `
        SELECT * FROM Users WHERE user_type = ?;
      `
      const [user] = await connection.query(usersQuery, ['DOCTOR'])
      if (user.length === 0) return false
      return user
    } catch (error) {
      console.error('Error en la consulta getUserByUserName:', error)
      throw error
    }
  }

  static async getAllNurse() {
    try {
      const usersQuery = `
        SELECT * FROM Users WHERE user_type = ?;
      `
      const [user] = await connection.query(usersQuery, ['NURSE'])
      if (user.length === 0) return false
      return user
    } catch (error) {
      console.error('Error en la consulta getUserByUserName:', error)
      throw error
    }
  }
}
