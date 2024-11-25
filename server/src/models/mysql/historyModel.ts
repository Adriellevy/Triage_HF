import { connect } from "../../config/db";
import { RowDataPacket } from "mysql2";
import { History } from "../../interface/history";

export interface IHistory extends History,RowDataPacket {}
export class HistoryModel{
    static async findById(id:any):Promise<IHistory>{
        const query = `SELECT * FROM PatientUpdateHistory WHERE updated_id = ?`;
        const conn = await connect();
        const [rows] = await conn.query<IHistory[]>(query, [id]);
        return rows[0];
    }
    static async create(history:{
        patient_updated_column: string;
        patient_old_value: string;
        patient_new_value: string;
        patient_updated_date: Date;
        patient_id: string;
        user_id: string;
    }){
        const query = `INSERT INTO PatientUpdateHistory (updated_id, patient_updated_column, patient_old_value, patient_new_value, patient_updated_date, patient_id, user_id) VALUES (UUID_TO_BIN(UUID()),?,?,?,?,UUID_TO_BIN(?),UUID_TO_BIN(?))`;
        const conn = await connect();
        const [result]:any = await conn.query(query,[history.patient_updated_column, history.patient_old_value, history.patient_new_value, history.patient_updated_date, history.patient_id, history.user_id]);
    }

    static async findAllTodayToReport():Promise<IHistory[]>{
        const query = `SELECT 
        BIN_TO_UUID(updated_id) AS updated_id,
        BIN_TO_UUID(patient_id) as patient_id,
        user_id,
        updated_id,
        patient_updated_column,
        patient_old_value,
        patient_new_value,
        patient_updated_date
        FROM PatientUpdateHistory WHERE DATE(patient_updated_date) = CURDATE() AND reported = 0`;
        const conn = await connect();
        const [rows] = await conn.query<IHistory[]>(query);
       
        return rows;
    }

    static async updateReported(id:string[]){
        const query = `UPDATE PatientUpdateHistory SET reported = 1 WHERE updated_id IN (?)`;
        const conn = await connect();
        const [result]:any = await conn.query(query,[id]);
    }
}