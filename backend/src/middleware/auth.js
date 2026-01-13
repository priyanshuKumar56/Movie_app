const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { cacheWrapper, cacheKeys } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Protect routes - Verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized. Please login to access this resource.',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check cache first for performance
      let user = await cacheWrapper.get(cacheKeys.userProfile(decoded.userId));

      if (!user) {
        // Fetch from database
        user = await User.findById(decoded.userId).select('-password');

        if (!user) {
          return res.status(401).json({
            status: 'error',
            message: 'User no longer exists',
          });
        }

        // Cache user data
        await cacheWrapper.set(cacheKeys.userProfile(decoded.userId), user, 7200); // 2 hours
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Your account has been deactivated',
        });
      }

      // Check if password was changed after token was issued
      if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
          status: 'error',
          message: 'Password recently changed. Please login again.',
        });
      }

      // Grant access
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token. Please login again.',
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token expired. Please login again.',
        });
      }

      throw error;
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Role-Based Access Control (RBAC)
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. This resource requires one of the following roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Silently fail - optional auth
        logger.debug('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth error:', error);
    next();
  }
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required',
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid refresh token',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired refresh token',
      });
    }
  } catch (error) {
    logger.error('Refresh token verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Token verification failed',
    });
  }
};

/**
 * Check if user owns the resource
 */
const checkOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    // Admins can access any resource
    if (req.user.role === 'ADMIN') {
      return next();
    }

    const resourceOwnerId = req.params[resourceField] || req.body[resourceField];

    if (resourceOwnerId && resourceOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You can only access your own resources.',
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  verifyRefreshToken,
  checkOwnership,
};
