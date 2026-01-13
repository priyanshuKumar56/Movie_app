const User = require('../models/User');
const { cacheWrapper, cacheKeys } = require('../config/redis');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

/**
 * Register new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Create user (role defaults to USER, only admins can create other admins)
    const user = await User.create({
      name,
      email,
      password,
      role: role && req.user?.role === 'ADMIN' ? role : 'USER',
    });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
    });
  }
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and validate credentials
    const user = await User.findByCredentials(email, password);

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Cache user data
    await cacheWrapper.set(cacheKeys.userProfile(user._id), user, 7200);

    logger.info(`User logged in: ${email}`);

    // Set cookie (optional)
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('token', accessToken, cookieOptions);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          userType: user.role,
          avatar: user.avatar,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);

    if (error.message.includes('credentials') || error.message.includes('locked')) {
      return res.status(401).json({
        status: 'error',
        message: error.message,
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Login failed',
    });
  }
};

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
exports.logout = async (req, res) => {
  try {
    // Clear refresh token
    req.user.refreshToken = undefined;
    await req.user.save();

    // Clear cache
    await cacheWrapper.del(cacheKeys.userProfile(req.user._id));

    // Clear cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
    });
  }
};

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access Public
 */
exports.refreshToken = async (req, res) => {
  try {
    // User is attached by verifyRefreshToken middleware
    const accessToken = req.user.generateAccessToken();

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Token refresh failed',
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/v1/auth/me
 * @access Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchHistory.movie', 'title posterUrl rating')
      .populate('favorites', 'title posterUrl rating')
      .populate('watchlist', 'title posterUrl rating');

    const userObj = user.toObject();
    userObj.id = user._id;
    userObj.userType = user.role;

    res.status(200).json({
      status: 'success',
      data: userObj,
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/v1/auth/me
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (avatar) fieldsToUpdate.avatar = avatar;
    if (preferences) fieldsToUpdate.preferences = preferences;

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    // Invalidate cache
    await cacheWrapper.del(cacheKeys.userProfile(user._id));

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
    });
  }
};

/**
 * Change password
 * @route PUT /api/v1/auth/change-password
 * @access Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    // Invalidate cache
    await cacheWrapper.del(cacheKeys.userProfile(user._id));

    logger.info(`Password changed: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password',
    });
  }
};

module.exports = exports;
