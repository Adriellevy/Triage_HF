import { type RowDataPacket } from 'mysql2/promise';
import { connect } from '../../config/db';
import { UserRole, type User } from '../../interface/user';

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

  static async getUserByID({ id }: { id: string }): Promise<User | undefined> {
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

  static async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const usersQuery = `
        SELECT 
          BIN_TO_UUID(User.user_id) AS user_id,
          User.user_name,
          User.user_full_name,
          User.user_email,
          User.user_specialization,
          User.user_type
        FROM User
        WHERE user_type = ?;
      `;

      const conn = await connect();
      const [rows] = await conn.query<RowDataPacket[]>(usersQuery, [role]);

      // Convertir y validar que cada fila cumple con la estructura de User
      const users: User[] = rows.map((row) => ({
        user_id: row.user_id as string,
        user_name: row.user_name as string,
        user_full_name: row.user_full_name as string,
        user_email: row.user_email as string,
        user_specialization: row.user_specialization as string | undefined,
        user_type: row.user_type as UserRole
      }));

      return users;
    } catch (error) {
      console.error('Error en la consulta getUsersByRole:', error);
      throw error;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    const conn = await connect();
    const [rows] = await conn.query<IUser[]>(`
      SELECT 
        HEX(user_id) as user_id, 
        user_name, 
        user_full_name, 
        user_email, 
        user_specialization, 
        user_type 
      FROM User
    `);

    return rows;
  }
}
