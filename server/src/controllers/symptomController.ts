import { UserRole } from "../interface/user";
import { symptomModel } from "../models/mysql/symptomModel";
import { UserModel } from "../models/mysql/userModel";

export class symptomController{

    static async getAll(req:any,res:any){
        const symptoms = await symptomModel.findAll();
        if(symptoms.length>0)
            return res.status(200).json({message:"Se obtuvieron todos los sintomas",data:symptoms});
        else
            return res.status(404).json({message:"No se encontraron síntomas"});
    }

    static async getById(req:any,res:any){
        const id = req.params.id;
        const symptom = await symptomModel.findById(id);
        if(symptom)
            return res.status(200).json({message:"Se obtuvo un sintomas",data:symptom});
        else
            return res.status(404).json({message:"No se encontró el síntoma "});
    }

    static async create(req:any,res:any){
        const userAdmin = await UserModel.getUserById(req.user.id)
        if(userAdmin?.user_type !== UserRole.HOSPITAL)
            return res.status(403).json({message:"No tienes permisos para realizar esta acción"});
        
        if(!req.body.name)
            return res.status(400).json({message:"El `name` del síntoma es requerido"});

        const symptom = await symptomModel.findByName(req.body.name);
        if(symptom)
            return res.status(400).json({message:`El síntoma ${req.body.name} ya existe`});
        
        try{
            const newSymptom = await symptomModel.create(req.body.name);
            return res.status(201).json({message:"Sintoma creado",data:newSymptom});
        }catch(err){
            return res.status(500).json({message:`Error al crear el síntoma: ${err.message}`});
        }
    }

    static async update(req:any,res:any){
        const userAdmin = await UserModel.getUserById(req.user.id)
        if(userAdmin?.user_type !== UserRole.HOSPITAL)
            return res.status(403).json({message:"No tienes permisos para realizar esta acción"});
        
        if(!req.body.name)
            return res.status(400).json({message:"El `name` del síntoma es requerido"});

        let symptom = await symptomModel.findById(req.params.id);
        if(!symptom)
            return res.status(404).json({message:`El síntoma con id ${req.params.id} no existe`});

        symptom = await symptomModel.findByName(req.body.name);
        if(symptom)
            return res.status(400).json({message:`El síntoma ${req.body.name} ya existe`});
        
        try{
            await symptomModel.update(req.body.name,req.params.id);
            return res.status(200).json({message:`Síntoma actualizado`,data:{id:req.params.id,name:req.body.name}});
        }catch(err){
            return res.status(500).json({message:`Error al actualizar el síntoma: ${err.message}`});
        }
    }

    static async delete(req:any,res:any){
        const userAdmin = await UserModel.getUserById(req.user.id)
        if(userAdmin?.user_type !== UserRole.HOSPITAL)
            return res.status(403).json({message:"No tienes permisos para realizar esta acción"});

        let symptom = await symptomModel.findById(req.params.id);
        if(!symptom)
            return res.status(404).json({message:`El síntoma con id ${req.params.id} no existe`});

        try{
            await symptomModel.delete(req.params.id);
            return res.status(200).json({message:`Síntoma eliminado`,data:symptom});
        }catch(err){
            return res.status(500).json({message:`Error al eliminar el síntoma: ${err.message}`});
        }
    }
}