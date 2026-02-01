import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { initRedis, closeRedis } from './config/redis';
import env from './config/env';
import logger from './config/logger';
import limiter from './middleware/rateLimiter';
import { securityHeaders, requestLogger, sanitizeInputs } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import newsRoutes from './routes/news.routes';
import healthRoutes from './routes/health.routes';

const app: Express = express();

// Trust proxy
app.set('trust proxy', 1);

// Security and parsing middleware
app.use(securityHeaders);
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitization and logging
app.use(sanitizeInputs);
app.use(requestLogger);

// Rate limiting
app.use(limiter);

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'News Reader API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      news: {
        topHeadlines: '/api/news/top-headlines',
        search: '/api/news/search',
        categories: '/api/news/categories/:category',
      },
    },
  });
});

// 404 handler
app.use(((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: _req.path,
  });
}) as any);

// Error handling middleware
app.use(errorHandler as any);

// Initialize and start server
async function startServer() {
  try {
    console.log('Starting server...');
    
    // Start server immediately
    const server = app.listen(env.port, () => {
      logger.info(`Server is running on port ${env.port}`, {
        environment: env.nodeEnv,
        corsOrigin: env.corsOrigin,
      });
      console.log(`✓ Server listening on http://localhost:${env.port}`);
    });

    // Initialize Redis in background (non-blocking)
    setImmediate(async () => {
      try {
        await initRedis();
        logger.info('Redis initialized');
        console.log('✓ Redis connected');
      } catch (redisError) {
        logger.warn('Redis initialization failed, continuing without caching', {
          error: redisError instanceof Error ? redisError.message : String(redisError),
        });
        console.log('⚠ Redis not available - caching disabled');
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        try {
          await closeRedis();
        } catch (e) {
          logger.warn('Error closing Redis connection', e);
        }
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        try {
          await closeRedis();
        } catch (e) {
          logger.warn('Error closing Redis connection', e);
        }
        process.exit(0);
      });
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', {
        promise: String(promise),
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

// Only start if not imported as module
if (require.main === module) {
  console.log('Starting server...');
  startServer().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

export default app;
