/* eslint-disable quotes */
/* eslint-disable camelcase */
import { connection } from '../../db.js'

export class BoxModel {
  static async getAllBoxes() {
    const boxQuery = `SELECT * FROM Box`
    const [boxes] = await connection.query(boxQuery)
    return boxes
  }
}
