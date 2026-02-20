import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
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