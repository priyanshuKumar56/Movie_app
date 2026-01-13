const { Queue, Worker } = require('bullmq');
const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');
const { scrapeImdbTop250 } = require('../services/imdbScraper');
const Movie = require('../models/Movie');

let imdbQueue = null;
let imdbWorker = null;

/**
 * Initialize IMDb scraping queue
 */
const initializeQueue = async () => {
  try {
    const connection = getRedisClient();

    // Create queue
    imdbQueue = new Queue('imdb-scraping', {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          count: 100,
          age: 24 * 3600, // 24 hours
        },
        removeOnFail: {
          count: 50,
        },
      },
    });

    // Create worker
    imdbWorker = new Worker(
      'imdb-scraping',
      async (job) => {
        logger.info(`Processing IMDb scraping job: ${job.id}`);

        try {
          const { batchSize = 50 } = job.data;

          // Scrape IMDb Top 250
          const movies = await scrapeImdbTop250();
          logger.info(`Scraped ${movies.length} movies from IMDb`);

          // Insert in batches to avoid overwhelming the database
          let inserted = 0;
          let updated = 0;

          for (let i = 0; i < movies.length; i += batchSize) {
            const batch = movies.slice(i, i + batchSize);

            for (const movieData of batch) {
              try {
                const existingMovie = await Movie.findOne({ imdbId: movieData.imdbId });

                if (existingMovie) {
                  // Update existing movie
                  await Movie.findByIdAndUpdate(existingMovie._id, movieData, {
                    new: true,
                    runValidators: true,
                  });
                  updated++;
                } else {
                  // Create new movie
                  await Movie.create(movieData);
                  inserted++;
                }
              } catch (error) {
                logger.error(`Error processing movie ${movieData.title}:`, error.message);
              }
            }

            // Update job progress
            const progress = Math.round(((i + batch.length) / movies.length) * 100);
            await job.updateProgress(progress);

            logger.info(`Batch processed: ${i + batch.length}/${movies.length} movies`);
          }

          logger.info(`IMDb sync completed: ${inserted} inserted, ${updated} updated`);

          return {
            success: true,
            inserted,
            updated,
            total: movies.length,
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          logger.error('IMDb scraping job failed:', error);
          throw error;
        }
      },
      {
        connection,
        concurrency: 1, // Process one job at a time
      }
    );

    // Event listeners
    imdbWorker.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed:`, result);
    });

    imdbWorker.on('failed', (job, err) => {
      logger.error(`Job ${job.id} failed:`, err.message);
    });

    imdbWorker.on('progress', (job, progress) => {
      logger.info(`Job ${job.id} progress: ${progress}%`);
    });

    logger.info('IMDb scraping queue initialized successfully');

    // Schedule periodic sync if enabled
    if (process.env.IMDB_SCRAPE_ENABLED === 'true') {
      const interval = parseInt(process.env.IMDB_SCRAPE_INTERVAL) || 86400000; // 24 hours
      await schedulePeriodicSync(interval);
    }

    return imdbQueue;
  } catch (error) {
    logger.error('Failed to initialize IMDb queue:', error);
    throw error;
  }
};

/**
 * Add IMDb sync job to queue
 */
const addImdbSyncJob = async (options = {}) => {
  try {
    if (!imdbQueue) {
      throw new Error('Queue not initialized');
    }

    const job = await imdbQueue.add(
      'sync-imdb',
      {
        batchSize: options.batchSize || 50,
        timestamp: new Date().toISOString(),
      },
      {
        priority: options.priority || 1,
        delay: options.delay || 0,
      }
    );

    logger.info(`IMDb sync job added: ${job.id}`);
    return job;
  } catch (error) {
    logger.error('Failed to add IMDb sync job:', error);
    throw error;
  }
};

/**
 * Schedule periodic IMDb sync
 */
const schedulePeriodicSync = async (interval) => {
  try {
    await imdbQueue.add(
      'sync-imdb',
      {
        batchSize: 50,
        periodic: true,
      },
      {
        repeat: {
          every: interval,
        },
      }
    );

    logger.info(`Periodic IMDb sync scheduled (every ${interval}ms)`);
  } catch (error) {
    logger.error('Failed to schedule periodic sync:', error);
  }
};

/**
 * Get queue stats
 */
const getQueueStats = async () => {
  try {
    if (!imdbQueue) {
      return null;
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      imdbQueue.getWaitingCount(),
      imdbQueue.getActiveCount(),
      imdbQueue.getCompletedCount(),
      imdbQueue.getFailedCount(),
      imdbQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  } catch (error) {
    logger.error('Failed to get queue stats:', error);
    return null;
  }
};

/**
 * Clean old jobs
 */
const cleanQueue = async () => {
  try {
    if (!imdbQueue) {
      return;
    }

    await imdbQueue.clean(24 * 3600 * 1000, 100, 'completed'); // Clean completed jobs older than 24h
    await imdbQueue.clean(7 * 24 * 3600 * 1000, 50, 'failed'); // Clean failed jobs older than 7 days

    logger.info('Queue cleaned successfully');
  } catch (error) {
    logger.error('Failed to clean queue:', error);
  }
};

/**
 * Graceful shutdown
 */
const closeQueue = async () => {
  try {
    if (imdbWorker) {
      await imdbWorker.close();
      logger.info('IMDb worker closed');
    }

    if (imdbQueue) {
      await imdbQueue.close();
      logger.info('IMDb queue closed');
    }
  } catch (error) {
    logger.error('Error closing queue:', error);
  }
};

module.exports = {
  initializeQueue,
  addImdbSyncJob,
  getQueueStats,
  cleanQueue,
  closeQueue,
};
