import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

export const handleRegister = catchAsync(async (req: Request, res: Response) => {
    await registerUser(req.body);
    return res.status(201).json({ message: "User Created Successfully" });
});

export const handleLogin = catchAsync(async (req: Request, res: Response) => {
    const result = await loginUser(req.body);
    return res.status(200).json({
        status: "success",
        message: "Login Successful",
        data: result
    });
});
