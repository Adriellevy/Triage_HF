import { connect } from "../../config/db";
import { RowDataPacket } from "mysql2";
import { History } from "../../interface/history";
export interface IHistory extends History,RowDataPacket {}
export class HistoryModel{
    static async findById(id:number):Promise<IHistory>{
        const query = `SELECT * FROM patientupdatehistory WHERE id = ?`;
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
    }):Promise<IHistory>{
        const query = `INSERT INTO patientupdatehistory ( patient_updated_column, patient_old_value, patient_new_value, patient_updated_date, patient_id, user_id) VALUES (?,?,?,?,?,?)`;
        const conn = await connect();
        const [result]:any = await conn.query(query,[ history.patient_updated_column, history.patient_old_value, history.patient_new_value, history.patient_updated_date, history.patient_id, history.user_id]);
        return this.findById(result.insertId);
    }

    static async findAllTodayToReport():Promise<IHistory[]>{
        const query = `SELECT * FROM patientupdatehistory WHERE DATE(patient_updated_date) = CURDATE() AND reported = 0`;
        const conn = await connect();
        const [rows] = await conn.query<IHistory[]>(query);
        return rows;
    }
}