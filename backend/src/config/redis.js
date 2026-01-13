const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient = null;
let isRedisConnected = false;

/**
 * Connect to Redis server (optional - app works without it)
 */
const connectRedis = async () => {
  return new Promise((resolve) => {
    // Set a timeout to not hang forever
    const timeout = setTimeout(() => {
      logger.warn('Redis connection timeout. Running without cache.');
      isRedisConnected = false;
      resolve(null);
    }, 5000);

    try {
      redisClient = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
          connectTimeout: 3000,
          reconnectStrategy: false // Don't reconnect, just fail
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });

      redisClient.on('error', (err) => {
        if (isRedisConnected) {
          logger.error('Redis Client Error:', err.message);
        }
        isRedisConnected = false;
      });

      redisClient.on('ready', () => {
        clearTimeout(timeout);
        logger.info('Redis client ready');
        isRedisConnected = true;
        resolve(redisClient);
      });

      redisClient.connect().catch((err) => {
        clearTimeout(timeout);
        logger.warn('Redis not available:', err.message);
        isRedisConnected = false;
        resolve(null);
      });
    } catch (error) {
      clearTimeout(timeout);
      logger.warn('Redis not available:', error.message);
      isRedisConnected = false;
      resolve(null);
    }
  });
};

/**
 * Get Redis client instance
 */
const getRedisClient = () => redisClient;

/**
 * Check if Redis is connected
 */
const isRedisAvailable = () => isRedisConnected;

/**
 * Cache wrapper (gracefully handles missing Redis)
 */
const cacheWrapper = {
  async get(key) {
    if (!isRedisConnected || !redisClient) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  },

  async set(key, value, ttl = 3600) {
    if (!isRedisConnected || !redisClient) return false;
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  },

  async del(key) {
    if (!isRedisConnected || !redisClient) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      return false;
    }
  },

  async delPattern(pattern) {
    if (!isRedisConnected || !redisClient) return false;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) await redisClient.del(keys);
      return true;
    } catch (error) {
      return false;
    }
  },

  async exists(key) {
    if (!isRedisConnected || !redisClient) return false;
    try {
      return await redisClient.exists(key);
    } catch (error) {
      return false;
    }
  },

  async incr(key) {
    if (!isRedisConnected || !redisClient) return null;
    try {
      return await redisClient.incr(key);
    } catch (error) {
      return null;
    }
  },

  async expire(key, seconds) {
    if (!isRedisConnected || !redisClient) return false;
    try {
      return await redisClient.expire(key, seconds);
    } catch (error) {
      return false;
    }
  },

  async flushAll() {
    if (!isRedisConnected || !redisClient) return false;
    try {
      await redisClient.flushAll();
      return true;
    } catch (error) {
      return false;
    }
  },
};

/**
 * Cache key generators
 */
const cacheKeys = {
  allMovies: (page, limit, sort) => `movies:all:${page}:${limit}:${sort}`,
  movieById: (id) => `movie:${id}`,
  searchMovies: (query, page) => `movies:search:${query}:${page}`,
  trendingMovies: () => 'movies:trending',
  userProfile: (userId) => `user:${userId}`,
  userWatchHistory: (userId) => `user:${userId}:history`,
  movieStats: () => 'stats:movies',
};

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisAvailable,
  cacheWrapper,
  cacheKeys,
};
