import {catchAsync} from "../utils/catchAsync.js";
import { Request, Response } from "express";
import * as resourceService from "../services/resource.js";
export const handleCreateResource = catchAsync(async(req:Request,res:Response)=>{
    const resource = await resourceService.createResource({
        ...req.body,
        userId: req.user?.id
    });
    res.status(201).json({
    status: "success",
    data: { resource },
  });
});
export const handleGetResource = catchAsync(async(req:Request,res:Response)=>{
    const userId = req.user?.id;
    if (!userId) {
        throw new Error("User identification failed");
    }
    const resource = await resourceService.getResource(userId);
    res.status(200).json({
        status: "success",
        results: resource.length,
        data: {
            resource
        }
    });
});