import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import crypto from "crypto";
import bcrypt from "bcrypt";
export const createResource = async (data: { name: string, secretData: string, userId: string }) => {
    return await prisma.resource.create({
        data: {
            name: data.name,
            secretData: data.secretData,
            userId: data.userId
        },
    });
};

export const getResource = async (userId: string) => {
    return await prisma.resource.findMany({
        where: { userId }
    });
};

export const updateResource = async (resourceId: string, userId: string, updateData: any) => {
    return await prisma.resource.updateMany({
        where: {
            id: resourceId,
            userId: userId
        },
        data: {
            ...updateData
        }
    });
};

export const deleteResource = async (resourceId: string, userId: string) => {
    return await prisma.resource.deleteMany({
        where: {
            id: resourceId,
            userId: userId
        }
    });
};

export const deleteAllResource = async () => {
    return await prisma.resource.deleteMany({});
}

export const updateResourceByAdmin = async (resourceId: string, updateData: any) => {
    return await prisma.resource.update({
        where: { id: resourceId },
        data: { ...updateData }
    });
};

export const generateApiKey = async (resourceId: string, userId: string) => {
    const resource = await prisma.resource.findUnique({
        where: { id: resourceId }
    });
    if (!resource || resource.userId !== userId) {
        throw new Error("Resource not found or unauthorized");
    }

    const rawKey = `shld_${crypto.randomBytes(24).toString('hex')}`;
    const hashedKey = await bcrypt.hash(rawKey, 10);
    await prisma.resource.update({
        where: { id: resourceId },
        data: { apiKey: hashedKey }
    });
    return rawKey;
};