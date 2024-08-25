import { type RowDataPacket } from 'mysql2/promise';
import { connect } from '../../config/db';
import { BoxStatus, type Box } from '../../interface/box';

export interface IBox extends Box, RowDataPacket {}
interface UUIDResult extends RowDataPacket {
  uuid: string;
}
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

  static async getBoxCodeById(boxId: string): Promise<IBox> {
    const boxCodeQuery = `
          SELECT box_code
          FROM Box
          WHERE box_id = UUID_TO_BIN(?);
        `;
    const conn = await connect();
    const [[boxes]] = await conn.query<IBox[]>(boxCodeQuery, [boxId]);
    return boxes;
  }

  static async addBox(newBoxData: Partial<IBox>): Promise<IBox | null> {
    try {
      const conn = await connect();
      const [uuidResult] = await conn.query<UUIDResult[]>('SELECT UUID() uuid;');
      const [{ uuid }] = uuidResult;

      const addBoxQuery = `
          INSERT INTO Box (box_id, box_code, box_type, box_time, box_status)
          VALUES (UUID_TO_BIN(?), ?, ?, ?, ?);
        `;

      await conn.execute(addBoxQuery, [
        uuid,
        newBoxData.box_code,
        newBoxData.box_type,
        null,
        BoxStatus.DISPONIBLE
      ]);

      const newBox = await this.getBoxCodeById(uuid);
      return newBox;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Método para actualizar un box existente
  static async updateBox(boxId: string, updatedBoxData: Partial<IBox>): Promise<IBox | null> {
    try {
      const updateBoxQuery = `
        UPDATE Box
        SET
          box_code = ?,
          box_type = ?,
          box_time = ?,
          box_status = ?
        WHERE box_id = UUID_TO_BIN(?);
      `;
      const conn = await connect();
      await conn.query(updateBoxQuery, [
        updatedBoxData.box_code,
        updatedBoxData.box_type,
        updatedBoxData.box_time,
        updatedBoxData.box_status,
        boxId
      ]);
      const updatedBox = await this.getBoxCodeById(boxId);
      return updatedBox;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
