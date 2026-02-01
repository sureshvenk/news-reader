import { createClient, RedisClientType } from 'redis';
import logger from './logger';
import env from './env';

let redisClient: RedisClientType | null = null;

async function initRedis(): Promise<RedisClientType> {
  try {
    const client = createClient({
      host: env.redisHost,
      port: env.redisPort,
      password: env.redisPassword,
      db: env.redisDb,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 3) {
            logger.error('Max Redis reconnection attempts reached');
            return new Error('Max retries reached');
          }
          return retries * 100;
        },
        connectTimeout: 3000, // 3 second timeout
      },
    } as any);

    client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    client.on('reconnecting', () => {
      logger.info('Reconnecting to Redis');
    });

    // Set connection timeout promise
    const connectionPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    redisClient = client as any;
    return client as any;
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    throw error;
  }
}

function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return redisClient;
}

async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.disconnect();
    redisClient = null;
  }
}

export { initRedis, getRedisClient, closeRedis };
