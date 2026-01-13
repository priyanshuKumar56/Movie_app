const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { addImdbSyncJob, getQueueStats } = require('../queues/imdbQueue');
const { cacheWrapper } = require('../config/redis');
const User = require('../models/User');
const Movie = require('../models/Movie');
const logger = require('../utils/logger');

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

/**
 * Sync IMDb Top 250
 * @route POST /api/v1/admin/sync-imdb
 * @access Private/Admin
 */
router.post('/sync-imdb', async (req, res) => {
  try {
    const { batchSize, priority } = req.body;

    const job = await addImdbSyncJob({
      batchSize: batchSize || 50,
      priority: priority || 1,
    });

    logger.info(`IMDb sync initiated by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'IMDb sync job added to queue',
      data: {
        jobId: job.id,
        status: 'queued',
      },
    });
  } catch (error) {
    logger.error('Sync IMDb error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to initiate IMDb sync',
    });
  }
});

/**
 * Get queue statistics
 * @route GET /api/v1/admin/queue-stats
 * @access Private/Admin
 */
router.get('/queue-stats', async (req, res) => {
  try {
    const stats = await getQueueStats();

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Get queue stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch queue statistics',
    });
  }
});

/**
 * Get system statistics
 * @route GET /api/v1/admin/stats
 * @access Private/Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalMovies, activeUsers, recentMovies] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments({ status: 'active' }),
      User.countDocuments({ isActive: true }),
      Movie.find({ status: 'active' }).sort({ createdAt: -1 }).limit(5).select('title createdAt'),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      movies: {
        total: totalMovies,
        recent: recentMovies,
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
      },
    };

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    logger.error('Get system stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch system statistics',
    });
  }
});

/**
 * Get all users
 * @route GET /api/v1/admin/users
 * @access Private/Admin
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password -refreshToken'),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      status: 'success',
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
});

/**
 * Update user role
 * @route PUT /api/v1/admin/users/:id/role
 * @access Private/Admin
 */
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    logger.info(`User role updated: ${user.email} to ${role} by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    logger.error('Update user role error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user role',
    });
  }
});

/**
 * Deactivate user
 * @route PUT /api/v1/admin/users/:id/deactivate
 * @access Private/Admin
 */
router.put('/users/:id/deactivate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    logger.info(`User deactivated: ${user.email} by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'User deactivated successfully',
      data: user,
    });
  } catch (error) {
    logger.error('Deactivate user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to deactivate user',
    });
  }
});

/**
 * Clear cache
 * @route POST /api/v1/admin/clear-cache
 * @access Private/Admin
 */
router.post('/clear-cache', async (req, res) => {
  try {
    const { pattern } = req.body;

    if (pattern) {
      await cacheWrapper.delPattern(pattern);
    } else {
      await cacheWrapper.flushAll();
    }

    logger.info(`Cache cleared by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Cache cleared successfully',
    });
  } catch (error) {
    logger.error('Clear cache error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear cache',
    });
  }
});

module.exports = router;
