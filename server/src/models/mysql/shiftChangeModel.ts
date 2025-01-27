
import { connect } from '../../config/db';
import { ShiftChange } from '../../interface/shift-change';

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
        console.log(shift);
        const conn = await connect();
        const sql = `INSERT INTO ShiftChange 
            (
                shift_id,
                user_id,
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
                UUID_TO_BIN(?),
                ?,
                ?,
                ? 
            )`;
        const result = await conn.execute(sql, [
            shift.shift_id,
            shift.user_id,
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
}