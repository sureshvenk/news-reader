import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { getRedisClient } from '../config/redis';
import { HealthCheckResponse } from '../types';
import logger from '../config/logger';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    let redisConnected = false;
    let redisError: string | undefined;

    try {
      const client = getRedisClient();
      await client.ping();
      redisConnected = true;
    } catch (error) {
      redisError = (error as any).message;
      logger.warn('Redis health check failed', { error: redisError });
    }

    const response: HealthCheckResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      redis: {
        connected: redisConnected,
        ...(redisError && { error: redisError }),
      },
    };

    res.json(response);
  })
);

export default router;
