import { type RowDataPacket } from 'mysql2/promise';
import { connect } from '../../db';
import { type Box } from '../../interface/box';

export interface IBox extends Box, RowDataPacket {}

export class BoxModel {
  static async getAllBoxes(): Promise<IBox[]> {
    const boxQuery = `
            SELECT
                BIN_TO_UUID(b.box_id) AS box_id,
                b.box_code,
                b.box_type,
                b.box_time,
                b.box_status,
                BIN_TO_UUID(p.patient_id) AS patient_id,
                p.patient_name
            FROM Box b
            LEFT JOIN Patient p ON b.box_id = p.box_id
        `;
    const conn = await connect();
    const [boxes] = await conn.query<IBox[]>(boxQuery);
    return boxes;
  }

  static async getAvailableBoxes(): Promise<IBox[]> {
    const boxQuery = `SELECT *, BIN_TO_UUID(box_id) box_id FROM Box WHERE box_status = 'DISPONIBLE'`;
    const conn = await connect();
    const [boxes] = await conn.query<IBox[]>(boxQuery);
    return boxes;
  }

  static async getAvailableBoxesCount(): Promise<number> {
    const boxQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Box
      WHERE box_status = "DISPONIBLE";
    `;
    const conn = await connect();
    const [boxes] = await conn.query<IBox[]>(boxQuery);
    return boxes[0].cantidad;
  }

  static async getBoxCodeById(boxId: string): Promise<IBox[]> {
    const boxCodeQuery = `
          SELECT box_code
          FROM Box
          WHERE box_id = UUID_TO_BIN(?);
        `;
    const conn = await connect();
    const [boxes] = await conn.query<IBox[]>(boxCodeQuery, [boxId]);
    return boxes;
  }
}
