import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// 1. Initialize Redis Client with Error Handling
export const redisClient = createClient({ 
    url: process.env.REDIS_URL || 'redis://localhost:6379' 
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis (Top-level await is supported in modern Node.js versions)
(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis for Rate Limiting');
    } catch (err) {
        console.error('❌ Could not connect to Redis:', err);
    }
})();

// 2. Global Limiter (Shared across Load Balancer workers)
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        status: 'fail',
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Fix: Using the RedisStore correctly with the client
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

// 3. Sensitive Limiter (Stricter for Auth/API Key generation)
export const sensitiveLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        status: 'fail',
        message: 'Too many attempts. Please try again in an hour.'
    },
    // We also use Redis store here to prevent "hopping" workers to reset limits
    store: new RedisStore({
        
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});