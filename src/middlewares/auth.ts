import { Request,Response,NextFunction } from "express";
import { ZodTypeAny ,ZodError } from "zod";
export const validate = (schema : ZodTypeAny )=>(req:Request,res:Response,next:NextFunction)=>{
    try{
        schema.parse(req.body);
        next();
    }catch(error){
        if(error instanceof ZodError){
           return res.status(400).json({
                status: "fail",
                error: error.issues.map(err => err.message)
           });
        }
        next(error);
    }
};