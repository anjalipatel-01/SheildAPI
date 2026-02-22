import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const restrictTo = (...allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role ?? "";
        if (!allowedRoles.includes(userRole)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }
        next();
    };
