
import { RowDataPacket } from 'mysql2';
import { connect } from '../../config/db';
import { ShiftChange } from '../../interface/shift-change';


export interface IShiftChange extends ShiftChange,RowDataPacket{} 
export class ShiftChangeModel{
    static async create(shift:{
        user_id: string;
        shift_id: number;
        last_doctor_id: string;
        new_doctor_id: string;
        last_nurse_id: string;
        new_nurse_id: string;
        patient_id: string;
        patient_observations?: string;
        patient_records?: string;
        patient_procedures?: string;
    }){
        const conn = await connect();
        console.log(shift)
        const sql = `INSERT INTO ShiftChange 
            (
                shift_id,
                last_doctor_id,
                new_doctor_id,
                last_nurse_id,
                new_nurse_id,
                patient_id,
                patient_observations,
                patient_records,
                patient_procedures
            ) VALUES (
                ?,
                UUID_TO_BIN(?),
                UUID_TO_BIN(?),
                UUID_TO_BIN(?),
                UUID_TO_BIN(?),
                UUID_TO_BIN(?),
                ?,
                ?,
                ? 
            )`;
        const result = await conn.execute(sql, [
            shift.shift_id,
            shift.last_doctor_id,
            shift.new_doctor_id,
            shift.last_nurse_id,
            shift.new_nurse_id,
            shift.patient_id,
            shift.patient_observations,
            shift.patient_records,
            shift.patient_procedures
        ]);

        return result;
    }


    static async getByShift(id:number):Promise<IShiftChange[]>{
        const conn = await connect();
        const sql = `SELECT 
            sc.id,
            sc.shift_id,
            BIN_TO_UUID(s.user_id) as user_id,
            BIN_TO_UUID(sc.last_doctor_id) as last_doctor_id,
            BIN_TO_UUID(sc.new_doctor_id) as new_doctor_id,
            BIN_TO_UUID(sc.last_nurse_id) as last_nurse_id,
            BIN_TO_UUID(sc.new_nurse_id) as new_nurse_id,
            BIN_TO_UUID(sc.patient_id) as patient_id,
            sc.patient_observations,
            sc.patient_records,
            sc.patient_procedures
        FROM ShiftChange sc JOIN Shift s ON shift_id = s.id WHERE shift_id = ?`;
        const [rows] = await conn.query<IShiftChange[]>(sql, [id]);
        console.log(rows)
        return rows;
    }


    static async getByPatientAndShifts(shifts:number[],patient:string|null):Promise<IShiftChange[]>{
        let sql = `SELECT 
            sc.id,
            sc.shift_id,
            BIN_TO_UUID(s.user_id) as user_id,
            BIN_TO_UUID(sc.last_doctor_id) as last_doctor_id,
            BIN_TO_UUID(sc.new_doctor_id) as new_doctor_id,
            BIN_TO_UUID(sc.last_nurse_id) as last_nurse_id,
            BIN_TO_UUID(sc.new_nurse_id) as new_nurse_id,
            BIN_TO_UUID(sc.patient_id) as patient_id,
            sc.patient_observations,
            sc.patient_records,
            sc.patient_procedures
        FROM  ShiftChange sc JOIN Shift s ON shift_id = s.id sc.shift_id IN (?)`;

        if(patient){
            sql += ' AND patient_id = ?';
        }

        const conn = await connect();
        const placeholders = shifts.map(() => '?').join(',');
        sql = sql.replace('IN (?)', `IN (${placeholders})`);
        const [rows] = await conn.query<IShiftChange[]>(sql, [...shifts, patient]);
        
        return rows;
    }

    static async getByPatientAndShift({patient,shift}):Promise<IShiftChange[]>{
        let sql = `SELECT
            sc.id,
            sc.shift_id,
            BIN_TO_UUID(s.user_id) as user_id,
            BIN_TO_UUID(sc.last_doctor_id) as last_doctor_id,
            BIN_TO_UUID(sc.new_doctor_id) as new_doctor_id,
            BIN_TO_UUID(sc.last_nurse_id) as last_nurse_id,
            BIN_TO_UUID(sc.new_nurse_id) as new_nurse_id,
            BIN_TO_UUID(sc.patient_id) as patient_id,
            sc.patient_observations as patient_observations,
            sc.patient_records as patient_records,
            sc.patient_procedures as patient_procedures        
            FROM ShiftChange sc`;

            const conditions: string[] = [];
            const params: any[] = [];

            // Agregar condiciones dinámicamente
            if (patient) {
                conditions.push('patient_id = UUID_TO_BIN(?)');
                params.push(patient);
            }
            if (shift) {
                conditions.push('shift_id = ?');
                params.push(shift);
            }
            sql += ` JOIN Shift s ON s.id = sc.shift_id`

            // Unir condiciones al SQL si existen
            if (conditions.length > 0) {
                sql += ` WHERE ${conditions.join(' AND ')}`;
            }
        const conn = await connect();
        const [rows] = await conn.query<IShiftChange[]>(sql, params);
        return rows;
    }

    static async getLastShiftChangeByPatientID(patient_id:string):Promise<IShiftChange>{
        const sql = `SELECT
            id,
            shift_id,
            BIN_TO_UUID(last_doctor_id) as last_doctor_id,
            BIN_TO_UUID(new_doctor_id) as new_doctor_id,
            BIN_TO_UUID(last_nurse_id) as last_nurse_id,
            BIN_TO_UUID(new_nurse_id) as new_nurse_id,
            BIN_TO_UUID(patient_id) as patient_id,
            patient_observations,
            patient_records,
            patient_procedures
        FROM ShiftChange WHERE patient_id = UUID_TO_BIN(?) ORDER BY id DESC LIMIT 1`;
        const conn = await connect();
        const [rows] = await conn.query<IShiftChange[]>(sql, [patient_id]);
        return rows[0];
    }
}