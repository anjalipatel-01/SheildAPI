import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response } from "express";
import * as resourceService from "../services/resource.js";
//create
export const handleCreateResource = catchAsync(async (req: Request, res: Response) => {
    const resource = await resourceService.createResource({
        ...req.body,
        userId: req.user?.id
    });
    res.status(201).json({
        status: "success",
        data: { resource },
    });
});
//view
export const handleGetResource = catchAsync(async (req: Request, res: Response) => {
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
//update
export const handleUpdateResource = catchAsync(async (req: Request, res: Response) => {
    const resourceId = req.params.id as string;
    const userId = req.user?.id as string;
    const result = await resourceService.updateResource(resourceId, userId, req.body);
    if (result.count === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Resource not found or unauthorized"
        });
    }
    res.status(200).json({
        status: "success",
        message: "Resource updated successfully"
    });
});

//delete
export const handleDeleteResource = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const resourceId = req.params.id as string;
    if (!userId || !resourceId) {
        throw new Error("Missing user or resource identification");
    }
    await resourceService.deleteResource(resourceId, userId);
    res.status(204).json({
        status: "success",
        data: null
    });
});

export const handleGenerateApiKey = catchAsync(async (req: Request, res: Response) => {
    const resourceId = req.params.id as string;
    const userId = req.user?.id as string;
    const rawKey = await resourceService.generateApiKey(resourceId, userId);
    res.status(200).json({
        status: "success",
        message: "API key generated. Store this key securely — it won't be shown again.",
        apiKey: rawKey
    });
});

export const handleExternalAccess = (req: Request, res: Response) => {
    // The middleware already verified the key and attached the resource
    if (!req.resource) {
        return res.status(500).json({ status: "error", message: "Resource not attached" });
    }
    res.status(200).json({
        status: "success",
        shieldedData: req.resource.secretData
    });
};