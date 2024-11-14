import { RowDataPacket } from "mysql2";
import { connect } from "../../config/db";
import { Triage } from "../../interface/triage";
export interface ITriage extends Triage,RowDataPacket {}

export class TriageModel{
    
    static async findByLevel(level:string):Promise<ITriage>{
        const query = `SELECT * FROM triage WHERE level = ?`;
        const conn = await connect();
        const [rows] = await conn.query<ITriage[]>(query, [level]);
        return rows[0];
    }

    static async findById(id:number):Promise<ITriage>{
        const query = `SELECT * FROM triage WHERE id = ?`;
        const conn = await connect();
        const [rows] = await conn.query<ITriage[]>(query, [id]);
        return rows[0];
    }

    static async findAll():Promise<ITriage[]>{
        const query = `SELECT * FROM triage`;
        const conn = await connect();
        const triages = await conn.query<ITriage[]>(query)
        return triages[0];
    }

    static async create(triage:{level:string,color:string}):Promise<ITriage>{
        const query = `INSERT INTO triage (level, color) VALUES (?,?)`;
        const conn = await connect();
        const [result]:any = await conn.query(query,[triage.level,triage.color]);
        return this.findById(result.insertId);
    }

    static async update(triage:{level:string,color:string}):Promise<ITriage>{
        const query = `UPDATE triage SET color = ? WHERE level = ?`;
        const conn = await connect();
        const [result]:any = await conn.query(query,[triage.color,triage.level]);
        return this.findByLevel(result.insertId);
    }

    static async delete(level:string){
        const query = `DELETE FROM triage WHERE level = ?`;
        const conn = await connect();
        const [result] = await conn.query(query,[level]);
    }
}