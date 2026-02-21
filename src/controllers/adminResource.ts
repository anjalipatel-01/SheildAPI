import * as resourceService from "../services/adminResource.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response } from "express";
//create 
export const handleAdminCreateResource = catchAsync(async (req: Request, res: Response) => {
    const { name, secretData, targetUserId } = req.body;
    
    if (!targetUserId) {
        return res.status(400).json({
            status: "fail",
            message: "Admin must provide a targetUserId to assign the resource."
        });
    }
    const newResource = await resourceService.createResourceByAdmin({
        name,
        secretData,
        targetUserId
    });

    res.status(201).json({
        status: "success",
        message: "Resource created and assigned by Admin",
        data: {
            resource: newResource
        }
    });
});
//view
export const handleGetAllResources = catchAsync(async (req: Request, res: Response) => {
    const allresources = await resourceService.getAllResource();

    res.status(200).json({
        status: "success",
        results: allresources.length,
        data: {
            resources: allresources
        }
    });
});
//update 
export const handleAdminUpdateResource = catchAsync(async (req: Request, res: Response) => {
    const  id  = req.params.id as string;
    
    const updatedResource = await resourceService.updateResourceByAdmin(id, req.body);

    res.status(200).json({
        status: "success",
        message: "Admin successfully updated resource",
        data: { resource: updatedResource }
    });
});
//delete 
export const handleAdminDeleteResource = catchAsync(async (req: Request, res: Response) => {
    const  id  = req.params.id as string;

    await resourceService.deleteResourceByAdmin(id);

    res.status(204).json({
        status: "success",
        data: null
    });
});

export const handleDeleteAllResources = catchAsync(async(req:Request,res:Response)=>{
    const result = await resourceService.purgeAllResources();

    res.status(200).json({
        status: "success",
        message: "System purge complete. All shielded resources have been removed.",
        data: {
            deletedCount: result.count
        }
    });
})