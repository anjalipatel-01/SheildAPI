

import { prisma } from "./prisma.js";

export const createAuditLog = async (
    adminId: string,
    action: string,
    targetId?: string,
    metadata?: any
) => {
    try {
        await prisma.auditLog.create({
            data: {
                adminId,
                action,
                targetId: targetId ?? null,
                details: metadata ? JSON.stringify(metadata) : null,
            },
        });
        console.log(`📄 Audit Log Recorded: ${action} by Admin ${adminId}`);
    } catch (error) {
        console.error("❌ Failed to create audit log:", error);
    }
};