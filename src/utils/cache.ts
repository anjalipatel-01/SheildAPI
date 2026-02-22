import { redisClient } from '../middlewares/rateLimit.js';
export const getCacheKey = (userId: string) => `resources:list:${userId}`;

export const invalidateCache = async (userId: string) => {
    const key = getCacheKey(userId);
    await redisClient.del(key);
    console.log(`Cache cleared for user: ${userId}`);
};