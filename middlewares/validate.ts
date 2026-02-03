import { Request,Response,NextFunction } from "express";
import { AnyZodObject,ZodError } from "zod/v3";
export const validate = (schema : AnyZodObject)=>(req:Request,res:Response,next:NextFunction)=>{
    try{
        schema.parse(req.body);
        next();
    }catch(error){
        if(error instanceof ZodError){
           return res.status(400).json({
                status: "fail",
                error: error.errors.map(err => err.message)
           });
        }
        next(error);
    }
};