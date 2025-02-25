import { NextFunction,Request,Response } from "express";
import { syncKey } from "../helpers/syncKeyHelper";

export const validateKeyMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => { 
    try {
        const activeKey = await syncKey();

        if (!activeKey) {
            res.status(401).send("Unauthorized");
            return;
        }

        next();
    } catch (error) {
        res.status(500).send("Server error");
        console.error(error);
    }
};