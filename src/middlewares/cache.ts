import { redisClient } from '../middlewares/rateLimit.js';
import { getCacheKey } from "../utils/cache.js";
import { Request, Response, NextFunction } from "express";

export const validateCache = async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.user?.id as string;
    if (!userId) return next();
    const key = getCacheKey(userId);
    try{
        const cachedData = await redisClient.get(key);
        if(cachedData){
            console.log('Serving from Redis Cache');
            return res.status(200).json({
                status: 'success',
                source: 'cache', 
                data: JSON.parse(cachedData)
            });
        }
       const sendResponse = res.json.bind(res);
        res.json = (body: any) => {

            if (res.statusCode === 200 && body?.data) {

            console.log("Saving response to Redis");

            redisClient.setEx(
                key,
                3600,
                JSON.stringify(body.data)
            );
        }

        return sendResponse(body);
        };
        next();
    }catch (error) {
        console.error('Cache Error:', error);
        next(); 
    }
};
