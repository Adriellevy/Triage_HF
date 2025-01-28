import { Router } from "express";
import { shiftController } from "../controllers/shiftController";


export const shiftRouter = Router();

shiftRouter.get('/current',(req,res)=>{
    void shiftController.getCurrent(req,res);
})



shiftRouter.get('',(req,res)=>{
    void shiftController.getAll(req,res);
})

shiftRouter.get('/changes',(req,res)=>{
    void shiftController.getShiftChanges(req,res);
})

shiftRouter.get('/:id',(req,res)=>{
    void shiftController.getById(req,res);
})