import { Request, Response } from "express";
import { LoginSchema,RegisterSchema } from "../schemas/auth.js";
import { registerUser } from "../services/auth.js";
import {catchAsync} from "../utils/catchAsync.js";

export const handleRegister = catchAsync(async (req: Request, res: Response) => {
    const newuser = await registerUser(req.body);
    return res.status(201).json({ message: "User Created Successfully" });
});
export const handleLogin = catchAsync( async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    return res.status(200).json({ 
        status: "success", 
        message: "Login Successful" 
    });
});
