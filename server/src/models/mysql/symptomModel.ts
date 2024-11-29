import { RowDataPacket } from "mysql2";
import { Symptom } from "../../interface/symptom";
import { connect } from "../../config/db";

export interface ISymptom extends Symptom,RowDataPacket {}
export class symptomModel{
        
        static async findAll():Promise<ISymptom[]>{
            try{
                const query = `SELECT * FROM Symptom`;
                const conn = await connect();
                const rows = await conn.query<ISymptom[]>(query);
                return rows[0]
            }catch(e){
                throw e
            }
        }
    
        static async findById(id:number):Promise<ISymptom>{
            try{
                const query = `SELECT * FROM Symptom WHERE id = ?`;
                const conn = await connect();
                const rows = await conn.query<ISymptom[]>(query,[id]);
                return rows[0][0];
            }catch(e){
                throw e
            }
        }

        static async findByName(name:string):Promise<ISymptom>{
            try{
                const query = `SELECT * FROM Symptom WHERE name = ?`;
                const conn = await connect();
                const rows = await conn.query<ISymptom[]>(query,[name]);
                return rows[0][0];
            }catch(e){
                throw e
            }
        }
    
        static async create(name:string){
            try{
                const query = `INSERT INTO Symptom (name) VALUES (?)`;
                const conn = await connect();
                const [result]:any = await conn.query(query,[name]);
                return this.findById(result.insertId);
            }catch(e){
                throw e
            }
        }
    
        static async update(name:string,id:number){
            try{
                const query = `UPDATE Symptom SET name = ? WHERE id = ?`;
                const conn = await connect();
                const [result]:any = await conn.query(query,[name,id]);
                return true;
            }catch(e){
                throw e
            }
        }
    
        static async delete(id:number){
            try{
                const query = `DELETE FROM Symptom WHERE id = ?`;
                const conn = await connect();
                const [result] = await conn.query(query,[id]);
                return true;
            }catch(e){
                throw e
            }
        }    
}