import { getRedisClient } from '../config/redis';
import logger from '../config/logger';
import env from '../config/env';
import { CacheMetadata } from '../types';

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = getRedisClient();
      const data = await client.get(key);

      if (data) {
        logger.info('Cache hit', { key });
        // Update metadata
        const metadata = await this.getMetadata(key);
        if (metadata) {
          metadata.hits += 1;
          await this.saveMetadata(key, metadata);
        }
        return JSON.parse(data) as T;
      }

      logger.info('Cache miss', { key });
      return null;
    } catch (error) {
      logger.warn('Cache get error', { key, error: (error as any).message });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = env.cacheTTL): Promise<void> {
    try {
      const client = getRedisClient();
      const serialized = JSON.stringify(value);
      await client.setEx(key, ttl, serialized);

      // Save metadata
      const metadata: CacheMetadata = {
        key,
        ttl,
        createdAt: Date.now(),
        hits: 0,
      };
      await this.saveMetadata(key, metadata);

      logger.info('Cache set', { key, ttl });
    } catch (error) {
      logger.warn('Cache set error', { key, error: (error as any).message });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const client = getRedisClient();
      await client.del(key);
      logger.info('Cache deleted', { key });
    } catch (error) {
      logger.warn('Cache delete error', { key, error: (error as any).message });
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const client = getRedisClient();
      const keys = await client.keys(pattern);

      if (keys.length > 0) {
        await client.del(keys);
        logger.info('Cache invalidated', { pattern, keysDeleted: keys.length });
      }
    } catch (error) {
      logger.warn('Cache invalidate pattern error', { pattern, error: (error as any).message });
    }
  }

  async clear(): Promise<void> {
    try {
      const client = getRedisClient();
      await client.flushDb();
      logger.info('Cache cleared');
    } catch (error) {
      logger.warn('Cache clear error', { error: (error as any).message });
    }
  }

  private async getMetadata(key: string): Promise<CacheMetadata | null> {
    try {
      const client = getRedisClient();
      const metadataKey = `metadata:${key}`;
      const data = await client.get(metadataKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private async saveMetadata(key: string, metadata: CacheMetadata): Promise<void> {
    try {
      const client = getRedisClient();
      const metadataKey = `metadata:${key}`;
      await client.setEx(metadataKey, metadata.ttl, JSON.stringify(metadata));
    } catch (error) {
      logger.warn('Failed to save cache metadata', { error: (error as any).message });
    }
  }
}

export default new CacheService();
