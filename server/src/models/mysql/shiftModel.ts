import { RowDataPacket } from 'mysql2';
import { connect } from '../../config/db';
import { Shift } from '../../interface/shift';
export interface IShift extends Shift, RowDataPacket {}
export class ShiftModel{

    static async getShiftById(id:number):Promise<IShift>{
        const conn = await connect();
        const [rows] = await conn.query<IShift[]>('SELECT * FROM Shift WHERE id = ?', [id]);
        return rows[0];
    }

    static async getShiftOfNow(now:Date):Promise<IShift[]>{
        const nowFormatted = now.toISOString().split('T')[0];
        const conn = await connect();
        const [rows] = await conn.query<IShift[]>('SELECT * FROM Shift WHERE shift_day = ?', [nowFormatted]);
        return rows;
    }
}