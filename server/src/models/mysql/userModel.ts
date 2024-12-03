import { type RowDataPacket } from 'mysql2/promise';
import { connect } from '../../config/db';
import { UserRole, type User } from '../../interface/user';

export interface IUser extends User, RowDataPacket {}

interface UUIDResult extends RowDataPacket {
  uuid: string;
}
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

  static async getAllDoctorsWithPatients(): Promise<User[] | undefined> {
    try{
      const usersQuery = `
      SELECT 
          BIN_TO_UUID(User.user_id) AS user_id,
          User.user_name,
          User.user_type
      FROM 
          User
      WHERE 
          User.user_type = 'DOCTOR'
          AND User.user_id IN (
              SELECT 
                  Patient.doctor_id
              FROM 
                  Patient
              WHERE 
                  Patient.patient_status != 'ALTA'
          );
      `;
      const conn = await connect();
      const [user] = await conn.query<IUser[]>(usersQuery, [UserRole.DOCTOR]);
      if (user.length === 0) return undefined;
      return user;
    } catch (error) {
      console.error('Error en la consulta getUserByUserName:', error);
      throw error;
    }
  }

  

  static async getAllNursesWithPatients(): Promise<User[] | undefined> {
    try{
      const usersQuery = `
      SELECT 
          BIN_TO_UUID(User.user_id) AS user_id,
          User.user_name,
          User.user_type
      FROM 
          User
      WHERE 
          User.user_type = 'NURSE'
          AND User.user_id IN (
              SELECT 
                  Patient.nurse_id
              FROM 
                  Patient
              WHERE 
                  Patient.patient_status != 'ALTA'
          );
      `;
      const conn = await connect();
      const [user] = await conn.query<IUser[]>(usersQuery, [UserRole.DOCTOR]);
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
        BIN_TO_UUID(user_id) as user_id, 
        user_name, 
        user_full_name, 
        user_email, 
        user_specialization, 
        user_type 
      FROM User
    `);

    return rows;
  }

  static async addUser(newUserData: Partial<User>): Promise<User | null> {
    try {
      const conn = await connect();
      const [uuidResult] = await conn.query<UUIDResult[]>('SELECT UUID() uuid;');
      const [{ uuid }] = uuidResult;

      const addUserQuery = `
        INSERT INTO User (user_id, user_name, user_full_name, user_email, user_specialization, user_password, user_type)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);
      `;

      await conn.execute(addUserQuery, [
        uuid,
        newUserData.user_name,
        newUserData.user_full_name,
        newUserData.user_email,
        newUserData.user_specialization,
        newUserData.user_password,
        newUserData.user_type
      ]);

      const newUser = await this.getUserById(uuid);
      return newUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Método para actualizar un usuario existente
  static async updateUser(userId: string, updatedUserData: Partial<User>): Promise<User | null> {
    try {
      if (!userId) {
        throw new Error('userId is required.');
      }

      const fieldsMap: { [key in keyof Partial<User>]: string } = {
        user_name: 'user_name = ?',
        user_full_name: 'user_full_name = ?',
        user_specialization: 'user_specialization = ?',
        user_password: 'user_password = ?',
        user_type: 'user_type = ?'
      };

      const updateFields = Object.keys(updatedUserData)
        .filter(
          (key) =>
            updatedUserData[key as keyof User] !== undefined &&
            key !== 'user_cellphone' &&
            key !== 'user_email' &&
            updatedUserData[key as keyof User] !== null
        )
        .map((key) => fieldsMap[key as keyof User]);

      const updateValues = Object.keys(updatedUserData)
        .filter(
          (key) =>
            updatedUserData[key as keyof User] !== undefined &&
            key !== 'user_cellphone' &&
            key !== 'user_email' &&
            updatedUserData[key as keyof User] !== null
        )
        .map((key) => updatedUserData[key as keyof User]);

      if (updateFields.length === 0) {
        return null; // No hay campos para actualizar
      }

      updateValues.push(userId); // Agregamos el userId al final para la cláusula WHERE

      const updateUserQuery = `
            UPDATE User
            SET ${updateFields.join(', ')}
            WHERE user_id = UUID_TO_BIN(?);
        `;

      const conn = await connect();
      await conn.query(updateUserQuery, updateValues);

      return await this.getUserById(userId);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Método para eliminar un usuario
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const deleteUserQuery = `
        DELETE FROM User
        WHERE user_id = UUID_TO_BIN(?);
      `;
      const conn = await connect();
      await conn.query(deleteUserQuery, [userId]);

      const userExists = await this.getUserById(userId);
      return !userExists;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Método para obtener un usuario por ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const getUserQuery = `
        SELECT BIN_TO_UUID(user_id) AS user_id, user_name, user_full_name, user_email, user_specialization, user_password, user_type
        FROM User
        WHERE user_id = UUID_TO_BIN(?);
      `;
      const conn = await connect();
      const [rows] = await conn.query<IUser[]>(getUserQuery, [userId]);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getAllUserByIds(userIds: string[]): Promise<User[] | null> {
    try {
      const placeholders = userIds.map(() => 'UUID_TO_BIN(?)').join(', ');
      const getUserQuery = `
        SELECT BIN_TO_UUID(user_id) AS user_id, user_name, user_full_name, user_email, user_specialization, user_password, user_type
        FROM User
        WHERE user_id IN (${placeholders});
      `;
      const conn = await connect();
      const rows = await conn.query<IUser[]>(getUserQuery, userIds);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
