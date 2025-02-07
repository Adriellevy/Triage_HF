import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { connect } from '../../config/db';
import { Shift } from '../../interface/shift';
export interface IShift extends Shift, RowDataPacket {}
export class ShiftModel {
  static async getShiftById(id: number): Promise<IShift> {
    const conn = await connect();
    const [rows] = await conn.query<IShift[]>(`SELECT 
        id,
        shift_day,
        BIN_TO_UUID(user_id) as user_id,
        shift_start_time,
        shift_end_time
        FROM Shift WHERE id = ?`, [id]);
    return rows[0];
  }

    static async createShift(day:string,start:number,end:number,user:string):Promise<number>{
        console.log(user,'user')
        const query = `
            INSERT INTO Shift(shift_day,shift_start_time,shift_end_time,user_id)
            VALUES(?,?,?,UUID_TO_BIN(?))
        `
        try{
            const conn = await connect();
            const [result] = await conn.execute<ResultSetHeader>(query, [day, start, end, user]);
            return result.insertId;
        }catch(e){
            throw e;
        }
    }

    static async getShiftOfNow(now:Date):Promise<IShift[]>{
        const nowFormatted = now.toISOString().split('T')[0];
        const conn = await connect();
        const [rows] = await conn.query<IShift[]>('SELECT id,shift_day, BIN_TO_UUID(user_id) as user_id,  shift_start_time, shift_end_time FROM Shift WHERE shift_day = ?', [nowFormatted]);
        
        return rows;
    }

    static async getAll(date:Date|null):Promise<IShift[]>{ 
        const conn = await connect();
        const sql = date ? 'SELECT id,shift_day, BIN_TO_UUID(user_id) as user_id,  shift_start_time, shift_end_time FROM Shift WHERE shift_day = ?' : 'SELECT id,shift_day, BIN_TO_UUID(user_id) as user_id, shift_start_time, shift_end_time FROM Shift';
        const [rows] = await conn.query<IShift[]>(sql, [date]);
        return rows;
    }
}
