import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";

import jwt from "jsonwebtoken";
import { signtoken } from "../utils/jwt.js";
import { prisma } from "../utils/prisma.js";
export const registerUser = async (userData: any) => {
    const { name, email, password } = userData;
    const exsistinguser = await prisma.user.findUnique({
        where:
            { email: email }
    });
    if (exsistinguser) {
        throw new AppError("User with this email already exists", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = await prisma.role.findUnique({
        where:
            { name: "USER" }
    });
    return await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            roleId: userRole!.id
        }
    });
};

export const loginUser = async (userData: any) => {
    const { email, password } = userData;
    const user = await prisma.user.findUnique({
        where:
            { email: email },
        include: {
            role: true
        }
    });
    if (!user) {
        throw new AppError("User does not exist", 404);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new AppError("Invalid Credentials", 401);
    }
    const token = await signtoken({ id: user.id, role: user.role.name });
    const { password: _, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token
    };
};