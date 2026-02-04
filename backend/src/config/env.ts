import dotenv from 'dotenv';

dotenv.config();

interface Environment {
  nodeEnv: string;
  port: number;
  newsApiKey: string;
  newsApiBaseUrl: string;
  redisHost: string;
  redisPort: number;
  redisPassword: string | undefined;
  redisDb: number;
  cacheTTL: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  corsOrigin: string;
  logLevel: string;
}

// Parse Redis URL if provided (for Railway, Heroku, etc.)
const parseRedisUrl = () => {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const url = new URL(redisUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port || '6379', 10),
        password: url.password || undefined,
      };
    } catch (e) {
      console.warn('Invalid REDIS_URL format');
    }
  }
  return null;
};

const redisConfig = parseRedisUrl();

const env: Environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  newsApiKey: process.env.NEWS_API_KEY || '',
  newsApiBaseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
  redisHost: redisConfig?.host || process.env.REDIS_HOST || 'localhost',
  redisPort: redisConfig?.port || parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: redisConfig?.password || process.env.REDIS_PASSWORD,
  redisDb: parseInt(process.env.REDIS_DB || '0', 10),
  cacheTTL: parseInt(process.env.CACHE_TTL || '600', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate critical environment variables
if (!env.newsApiKey) {
  console.warn('WARNING: NEWS_API_KEY is not set. Some features may not work.');
}

export default env;
