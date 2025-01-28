import { ShiftComplete } from "../interface/shift";
import { ShiftChange } from "../interface/shift-change";
import { UserRole } from "../interface/user";
import { ShiftChangeModel } from "../models/mysql/shiftChangeModel";
import { IShift, ShiftModel } from "../models/mysql/shiftModel";
import { UserModel } from "../models/mysql/userModel";

export class shiftController{

    static async getCurrent(req:any,res:any):Promise<IShift | undefined>{
        try{
            const now = new Date();
            const shift = await ShiftModel.getShiftOfNow(now);
            if(shift.length===0){
                return res.status(404).send({message:'No hay turnos creados para hoy'});   
            }
            const shiftID = shift.find((s)=> now.getHours() >= s.shift_start_time && now.getHours() <= s.shift_end_time);
            if(!shiftID){
                return res.status(404).send({message:'No hay turnos activos para ahora'});   
            }
            return res.status(200).send(shiftID);
        }catch(e){
            console.log('Error en shiftController.getCurrent',e.message);
            res.status(500).send({message:'Error en shiftController.getCurrent'});
        }
    }

    static async getById(req:any,res:any):Promise<ShiftComplete | undefined>{
        try{
            const id = req.params.id;
            const shift = await ShiftModel.getShiftById(id);
            if(!shift){
                return res.status(404).send({message:'Turno no encontrado'});   
            }
            const shiftChanges = await ShiftChangeModel.getByShift(id);
            return res.status(200).send({shift,shiftChanges});
        }catch(e){
            console.log('Error en shiftController.getById',e.message);
            res.status(500).send({message:'Error en shiftController.getById'});
        }
    }

    static async getAll(req:any,res:any):Promise<IShift[] | undefined>{
        try{
            const shifts = await ShiftModel.getAll(req.query.date || null);
            if(shifts.length===0){
                return res.status(404).send({message:'No hay turnos creados'});   
            }
            return res.status(200).send(shifts);
        }catch(e){
            console.log('Error en shiftController.getAll',e.message);
            res.status(500).send({message:'Error en shiftController.getAll'});
        }
    }

    static async getShiftChanges(req:any,res:any):Promise<ShiftChange[] | undefined>{
        try{
            const {patient,date,shift} = req.query;
            let shifts:IShift[] = [];
            let shiftChanges:ShiftChange[] = [];
            if(date){
                shifts = await ShiftModel.getAll(date);
                if(shifts.length===0){
                    return res.status(404).send({message:`No hay turnos creados para la fecha: ${date}`});   
                }
                shiftChanges = await ShiftChangeModel.getByPatientAndShifts(shifts.map((s)=>s.id),patient || null);
            }else{
                shiftChanges = await ShiftChangeModel.getByPatientAndShift({patient:patient||null,shift:shift||null});
            }

            return res.status(200).send(shiftChanges);
        }catch(e){
            console.log('Error en shiftController.getShiftChanges',e.message);
            res.status(500).send({message:'Error en shiftController.getShiftChanges'});
        }
    }
}