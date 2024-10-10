import 'dotenv/config';
import { connect } from '../../config/db';
import { type Patient } from '../../interface/patient';
import { type RowDataPacket } from 'mysql2/promise';

export interface IPatinet extends Patient, RowDataPacket {}

interface UUIDResult extends RowDataPacket {
  uuid: string;
}

export class queryModel {
  static async getPatientsByQuery(Query: string): Promise<IPatinet[]> {
    try {
      const conn = await connect();
      const [rows] = await conn.query<IPatinet[]>(Query);
      return rows;
    } catch (error) {
      console.error('Error al obtener los pacientes por nombre:', error);
      throw error;
    }
  }
}
