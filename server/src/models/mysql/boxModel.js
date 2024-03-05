/* eslint-disable quotes */
/* eslint-disable camelcase */
import { connection } from '../../db.js'

export class BoxModel {
  static async getAllBoxes() {
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
        `
    const [boxes] = await connection.query(boxQuery)
    return boxes
  }

  static async getAvailableBoxes() {
    const boxQuery = `SELECT *, BIN_TO_UUID(box_id) box_id FROM Box WHERE box_status = 'DISPONIBLE'`
    const [boxes] = await connection.query(boxQuery)
    return boxes
  }

  static async getAvailableBoxesCount() {
    const availableBoxesQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Box
      WHERE box_status = "DISPONIBLE";
    `
    const [result] = await connection.query(availableBoxesQuery)
    return result[0].cantidad
  }
}
