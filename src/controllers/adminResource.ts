import * as resourceService from "../services/adminResource.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response } from "express";
import { createAuditLog } from "../utils/logg.js";

export const handleAdminCreateResource = catchAsync(async (req: Request, res: Response) => {
    const { name, secretData, targetUserId } = req.body;
    const adminId = req.user?.id as string;

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

    createAuditLog(adminId, "ADMIN_CREATE", newResource.id, { targetUserId });

    res.status(201).json({
        status: "success",
        message: "Resource created and assigned by Admin",
        data: {
            resource: newResource
        }
    });
});

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

export const handleAdminUpdateResource = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const adminId = req.user?.id as string;

    const updatedResource = await resourceService.updateResourceByAdmin(id, req.body);

    createAuditLog(adminId, "ADMIN_UPDATE", id);

    res.status(200).json({
        status: "success",
        message: "Admin successfully updated resource",
        data: { resource: updatedResource }
    });
});

export const handleAdminDeleteResource = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const adminId = req.user?.id as string;

    await resourceService.deleteResourceByAdmin(id);

    createAuditLog(adminId, "ADMIN_DELETE", id);

    res.status(204).json({
        status: "success",
        data: null
    });
});

export const handleDeleteAllResources = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id as string;
    const result = await resourceService.purgeAllResources();

    createAuditLog(adminId, "SYSTEM_PURGE", undefined, { count: result.count });

    res.status(200).json({
        status: "success",
        message: "System purge complete. All shielded resources have been removed.",
        data: {
            deletedCount: result.count
        }
    });
})

export const handleGetAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const logs = await resourceService.getAllAuditLogs();

    res.status(200).json({
        status: "success",
        results: logs.length,
        data: { logs }
    });
});