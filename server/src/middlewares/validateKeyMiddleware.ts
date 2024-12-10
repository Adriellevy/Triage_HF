import { NextFunction,Request,Response } from "express";

import activeKey  from './../helpers/syncKeyHelper';
export const validateKeyMiddleware = async (req: Request,res: Response,next: NextFunction) : Promise<void> => { 
    if(activeKey){
        next();
    }else{
        res.status(401).send('Unauthorized');
    }
}