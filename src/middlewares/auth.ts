import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { verifyToken } from "../utils/jwt.js";
import { AuthUser } from "../types/authUser.js";
export const validate = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                status: "fail",
                error: error.issues.map(err => err.message)
            });
        }
        next(error);
    }
};
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");
    try {
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No token provided"
            });
        }
        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: Malformed token" });
        }
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        req.user = decoded as AuthUser;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
