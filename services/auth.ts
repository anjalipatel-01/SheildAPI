import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const exsistinguser = await prisma.user.findUnique({
        where:
            { email: email }
    });
    if (exsistinguser) {
        throw new Error("User with this email already exists");
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