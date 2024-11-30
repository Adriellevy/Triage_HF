import { Router } from "express";
import { symptomController } from "../controllers/symptomController";

export const symptomRouter = Router();

symptomRouter.get('',(req,res)=>{
    void symptomController.getAll(req,res);
})

symptomRouter.get('/:id',(req,res)=>{
    void symptomController.getById(req,res);
})

symptomRouter.post('',(req,res)=>{
    void symptomController.create(req,res);
})

symptomRouter.put('/:id',(req,res)=>{
    void symptomController.update(req,res);
})

symptomRouter.delete('/:id',(req,res)=>{
    void symptomController.delete(req,res);
})