const express = require('express');
const router = express.Router();
const { authenticate, checkOwnership } = require('../middleware/auth');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Add movie to watch history
 * @route POST /api/v1/users/watch-history
 * @access Private
 */
router.post('/watch-history', authenticate, async (req, res) => {
  try {
    const { movieId, progress } = req.body;

    await req.user.addToWatchHistory(movieId, progress);

    res.status(200).json({
      status: 'success',
      message: 'Added to watch history',
    });
  } catch (error) {
    logger.error('Add to watch history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add to watch history',
    });
  }
});

/**
 * Get watch history
 * @route GET /api/v1/users/watch-history
 * @access Private
 */
router.get('/watch-history', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchHistory.movie', 'title posterUrl rating duration')
      .select('watchHistory');

    res.status(200).json({
      status: 'success',
      data: user.watchHistory,
    });
  } catch (error) {
    logger.error('Get watch history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch watch history',
    });
  }
});

/**
 * Add to favorites
 * @route POST /api/v1/users/favorites/:movieId
 * @access Private
 */
router.post('/favorites/:movieId', authenticate, async (req, res) => {
  try {
    await req.user.addToFavorites(req.params.movieId);

    res.status(200).json({
      status: 'success',
      message: 'Added to favorites',
    });
  } catch (error) {
    logger.error('Add to favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add to favorites',
    });
  }
});

/**
 * Remove from favorites
 * @route DELETE /api/v1/users/favorites/:movieId
 * @access Private
 */
router.delete('/favorites/:movieId', authenticate, async (req, res) => {
  try {
    await req.user.removeFromFavorites(req.params.movieId);

    res.status(200).json({
      status: 'success',
      message: 'Removed from favorites',
    });
  } catch (error) {
    logger.error('Remove from favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove from favorites',
    });
  }
});

/**
 * Get favorites
 * @route GET /api/v1/users/favorites
 * @access Private
 */
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title posterUrl rating duration genres releaseDate')
      .select('favorites');

    res.status(200).json({
      status: 'success',
      data: user.favorites,
    });
  } catch (error) {
    logger.error('Get favorites error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch favorites',
    });
  }
});

/**
 * Add to watchlist
 * @route POST /api/v1/users/watchlist/:movieId
 * @access Private
 */
router.post('/watchlist/:movieId', authenticate, async (req, res) => {
  try {
    await req.user.addToWatchlist(req.params.movieId);

    res.status(200).json({
      status: 'success',
      message: 'Added to watchlist',
    });
  } catch (error) {
    logger.error('Add to watchlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add to watchlist',
    });
  }
});

/**
 * Remove from watchlist
 * @route DELETE /api/v1/users/watchlist/:movieId
 * @access Private
 */
router.delete('/watchlist/:movieId', authenticate, async (req, res) => {
  try {
    await req.user.removeFromWatchlist(req.params.movieId);

    res.status(200).json({
      status: 'success',
      message: 'Removed from watchlist',
    });
  } catch (error) {
    logger.error('Remove from watchlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove from watchlist',
    });
  }
});

/**
 * Get watchlist
 * @route GET /api/v1/users/watchlist
 * @access Private
 */
router.get('/watchlist', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchlist', 'title posterUrl rating duration genres releaseDate')
      .select('watchlist');

    res.status(200).json({
      status: 'success',
      data: user.watchlist,
    });
  } catch (error) {
    logger.error('Get watchlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch watchlist',
    });
  }
});

module.exports = router;
