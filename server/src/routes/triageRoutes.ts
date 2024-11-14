import { Router, Request, Response } from "express";
import { TriageController } from "../controllers/triageController";

export const triageRouter = Router();

triageRouter.get('',(req:Request,res:Response)=>{
    void TriageController.getAllTriage(req,res)
})

triageRouter.post('',(req:Request,res:Response)=>{
    void TriageController.createNewTriage(req,res)
})

triageRouter.put('/:id',(req:Request,res:Response)=>{
    void TriageController.updateTriage(req,res)
})

triageRouter.delete('/:id',(req:Request,res:Response)=>{
    void TriageController.deleteTriage(req,res)
})