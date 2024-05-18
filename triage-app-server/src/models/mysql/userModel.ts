/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable camelcase */
import { type RowDataPacket } from 'mysql2/promise';
import { connect } from '../../db';
import { type User } from '../../interface/user';

export interface IUser extends User, RowDataPacket {}

export class UserModel {
  static async getUserByUserName(user_name: string): Promise<User | undefined> {
    try {
      const usersQuery = `
        SELECT 
        BIN_TO_UUID(User.user_id) AS user_id,
        User.user_name,
        User.user_full_name,
        User.user_specialization,
        User.user_password,
        User.user_email,
        User.user_type
        FROM User WHERE User.user_name = ?;
      `;
      const conn = await connect();
      const [user] = await conn.query<IUser[]>(usersQuery, [user_name]);
      if (user.length === 0) return undefined;
      return user[0];
    } catch (error) {
      console.error('Error en la consulta getUserByUserName:', error);
      throw error;
    }
  }

  static async getUserByID({ id }): Promise<User | undefined> {
    try {
      const usersQuery = `
        SELECT 
        BIN_TO_UUID(User.user_id) AS user_id,
        User.user_name,
        User.user_full_name,
        User.user_specialization,
        User.user_type
        FROM User WHERE user_id = UUID_TO_BIN(?);
      `;
      const conn = await connect();
      const [user] = await conn.query<IUser[]>(usersQuery, [id]);
      if (user.length === 0) return undefined;
      const { user_id, user_email, user_name, user_type, user_full_name, user_specialization } =
        user[0];
      return {
        user_id,
        user_name,
        user_type,
        user_full_name,
        user_specialization,
        user_email
      };
    } catch (error) {
      console.error('Error en la consulta getUserByID:', error);
      throw error;
    }
  }

  /*
  static async createNewUser(data) {
    // TODO
    const { user_name, user_email, hash_password } = data;
  }
  */

  static async getAllDoctors(): Promise<User[] | undefined> {
    try {
      const usersQuery = `
        SELECT 
        BIN_TO_UUID(User.user_id) AS user_id,
        User.user_name,
        User.user_type
        FROM User WHERE user_type = ?;
      `;
      const conn = await connect();
      const [user] = await conn.query<IUser[]>(usersQuery, ['DOCTOR']);
      if (user.length === 0) return undefined;
      return user;
    } catch (error) {
      console.error('Error en la consulta getUserByUserName:', error);
      throw error;
    }
  }

  static async getAllNurse(): Promise<User[] | undefined> {
    try {
      const usersQuery = `
        SELECT 
        BIN_TO_UUID(User.user_id) AS user_id,
        User.user_name,
        User.user_type 
        FROM User WHERE user_type = ?;
      `;
      const conn = await connect();
      const [user] = await conn.query<IUser[]>(usersQuery, ['NURSE']);
      if (user.length === 0) return undefined;
      return user;
    } catch (error) {
      console.error('Error en la consulta getUserByUserName:', error);
      throw error;
    }
  }
}
