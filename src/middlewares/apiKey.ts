import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkApiKey = async(req:Request,res:Response,next:NextFunction)=>{
    const apiKey = req.header("x-api-key");
    const resourceId = req.header("x-resource-id");
    if(!apiKey || !resourceId){
        return res.status(401).json({ message: "Missing API Key or Resource ID" });
    }
    const resource = await prisma.resource.findUnique({
        where: { id: resourceId }
    });

    if (!resource || !resource.apiKey) {
        return res.status(401).json({ message: "Invalid Resource or Key not set" });
    }
    const isMatch = await bcrypt.compare(apiKey, resource.apiKey);

    if (!isMatch) {
        return res.status(403).json({ message: "Shield Access Denied: Invalid Key" });
    }
    req.resource = resource; 
    next();
}