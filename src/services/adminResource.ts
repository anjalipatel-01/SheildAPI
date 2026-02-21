import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//create 
export const createResourceByAdmin = async (data: { name: string; secretData: string; targetUserId: string }) => {
    return await prisma.resource.create({
        data: {
            name: data.name,
            secretData: data.secretData,
            userId: data.targetUserId, // The Admin assigns this to a specific user
        },
    });
};
//view
export const getAllResource = async () => {
    return await prisma.resource.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
};
//update
export const updateResourceByAdmin = async (resourceId: string, updateData: any) => {
    return await prisma.resource.update({
        where: { id: resourceId },
        data: { ...updateData }
    });
};
//delete 
export const deleteResourceByAdmin = async (resourceId: string) => {
    return await prisma.resource.delete({
        where: { id: resourceId }
    });
};
export const purgeAllResources = async () => {
    return await prisma.resource.deleteMany({});
};