import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import {signtoken} from "../utils/jwt.js";
const prisma = new PrismaClient();
export const registerUser = async (userData: any) => {
    const { name, email, password } = userData;
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

export const loginUser = async(userData: any)=>{
    const {email,password} = userData;
    const user = await prisma.user.findUnique({where:
        {email:email},
        include: { 
        role: true 
    }
    });
    if(!user){
        throw new Error("User does not exsist");
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        throw new Error("Invalid Credentials");
    }
    const token = await signtoken({ id: user.id, role: user.role.name });
    const { password: _, ...userWithoutPassword } = user;
    return {
        user : userWithoutPassword,
        token
    };
};