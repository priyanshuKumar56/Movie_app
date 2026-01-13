const Movie = require('../models/Movie');
const { cacheWrapper, cacheKeys } = require('../config/redis');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

/**
 * Get all movies with pagination, sorting, and filtering
 * @route GET /api/v1/movies
 * @access Public
 */
exports.getAllMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-rating',
      genre,
      minRating,
      maxRating,
      year,
      search,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit) > 100 ? 100 : parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { status: 'active' };

    if (genre) {
      query.genres = genre;
    }

    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = parseFloat(minRating);
      if (maxRating) query.rating.$lte = parseFloat(maxRating);
    }

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      query.releaseDate = { $gte: startDate, $lte: endDate };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Check cache
    const cacheKey = cacheKeys.allMovies(pageNum, limitNum, sort);
    const cachedData = await cacheWrapper.get(cacheKey);

    if (cachedData && !search && !genre && !minRating && !maxRating && !year) {
      return res.status(200).json({
        status: 'success',
        cached: true,
        ...cachedData,
      });
    }

    // Fetch from database
    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-__v')
        .lean(),
      Movie.countDocuments(query),
    ]);

    const result = {
      data: movies,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    };

    // Cache the result
    if (!search && !genre && !minRating && !maxRating && !year) {
      await cacheWrapper.set(cacheKey, result, 3600); // 1 hour
    }

    res.status(200).json({
      status: 'success',
      cached: false,
      ...result,
    });
  } catch (error) {
    logger.error('Get all movies error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movies',
    });
  }
};

/**
 * Get movie by ID
 * @route GET /api/v1/movies/:id
 * @access Public
 */
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check cache
    const cacheKey = cacheKeys.movieById(id);
    const cachedMovie = await cacheWrapper.get(cacheKey);

    if (cachedMovie) {
      return res.status(200).json({
        status: 'success',
        cached: true,
        data: cachedMovie,
      });
    }

    // Fetch from database
    const movie = await Movie.findById(id).select('-__v');

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found',
      });
    }

    // Increment view count asynchronously
    movie.incrementViews().catch((err) => logger.error('Failed to increment views:', err));

    // Cache the result
    await cacheWrapper.set(cacheKey, movie, 3600); // 1 hour

    res.status(200).json({
      status: 'success',
      cached: false,
      data: movie,
    });
  } catch (error) {
    logger.error('Get movie by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movie',
    });
  }
};

/**
 * Search movies
 * @route GET /api/v1/movies/search
 * @access Public
 */
exports.searchMovies = async (req, res) => {
  try {
    const { q, page = 1, limit = 20, sort = '-rating' } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit) > 100 ? 100 : parseInt(limit);

    // Check cache
    const cacheKey = cacheKeys.searchMovies(q, pageNum);
    const cachedResults = await cacheWrapper.get(cacheKey);

    if (cachedResults) {
      return res.status(200).json({
        status: 'success',
        cached: true,
        ...cachedResults,
      });
    }

    // Search in database
    const result = await Movie.searchMovies(q, {
      page: pageNum,
      limit: limitNum,
      sort,
    });

    // Cache results
    await cacheWrapper.set(cacheKey, result, 1800); // 30 minutes

    res.status(200).json({
      status: 'success',
      cached: false,
      data: result.movies,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error('Search movies error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Search failed',
    });
  }
};

/**
 * Get trending movies
 * @route GET /api/v1/movies/trending
 * @access Public
 */
exports.getTrendingMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Check cache
    const cacheKey = cacheKeys.trendingMovies();
    const cachedMovies = await cacheWrapper.get(cacheKey);

    if (cachedMovies) {
      return res.status(200).json({
        status: 'success',
        cached: true,
        data: cachedMovies,
      });
    }

    // Fetch trending movies
    const movies = await Movie.getTrending(parseInt(limit));

    // Cache results
    await cacheWrapper.set(cacheKey, movies, 1800); // 30 minutes

    res.status(200).json({
      status: 'success',
      cached: false,
      data: movies,
    });
  } catch (error) {
    logger.error('Get trending movies error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch trending movies',
    });
  }
};

/**
 * Get movies by genre
 * @route GET /api/v1/movies/genre/:genre
 * @access Public
 */
exports.getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 20, sort = '-rating' } = req.query;

    const result = await Movie.getByGenre(genre, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
    });

    res.status(200).json({
      status: 'success',
      data: result.movies,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error('Get movies by genre error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch movies by genre',
    });
  }
};

/**
 * Create new movie (Admin only)
 * @route POST /api/v1/movies
 * @access Private/Admin
 */
exports.createMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    }

    const movieData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const movie = await Movie.create(movieData);

    // Invalidate cache
    await cacheWrapper.delPattern('movies:*');

    logger.info(`Movie created: ${movie.title} by ${req.user.email}`);

    res.status(201).json({
      status: 'success',
      data: movie,
    });
  } catch (error) {
    logger.error('Create movie error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Movie with this IMDb ID already exists',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create movie',
    });
  }
};

/**
 * Update movie (Admin only)
 * @route PUT /api/v1/movies/:id
 * @access Private/Admin
 */
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found',
      });
    }

    // Invalidate cache
    await cacheWrapper.del(cacheKeys.movieById(id));
    await cacheWrapper.delPattern('movies:*');

    logger.info(`Movie updated: ${movie.title} by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      data: movie,
    });
  } catch (error) {
    logger.error('Update movie error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update movie',
    });
  }
};

/**
 * Delete movie (Admin only)
 * @route DELETE /api/v1/movies/:id
 * @access Private/Admin
 */
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found',
      });
    }

    // Invalidate cache
    await cacheWrapper.del(cacheKeys.movieById(id));
    await cacheWrapper.delPattern('movies:*');

    logger.info(`Movie deleted: ${movie.title} by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    logger.error('Delete movie error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete movie',
    });
  }
};

/**
 * Get movie statistics
 * @route GET /api/v1/movies/stats
 * @access Public
 */
exports.getMovieStats = async (req, res) => {
  try {
    const cacheKey = cacheKeys.movieStats();
    const cachedStats = await cacheWrapper.get(cacheKey);

    if (cachedStats) {
      return res.status(200).json({
        status: 'success',
        cached: true,
        data: cachedStats,
      });
    }

    const [total, byGenre, avgRating, topRated] = await Promise.all([
      Movie.countDocuments({ status: 'active' }),
      Movie.aggregate([
        { $match: { status: 'active' } },
        { $unwind: '$genres' },
        { $group: { _id: '$genres', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Movie.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]),
      Movie.find({ status: 'active' }).sort({ rating: -1 }).limit(10).select('title rating'),
    ]);

    const stats = {
      total,
      byGenre,
      avgRating: avgRating[0]?.avgRating || 0,
      topRated,
    };

    await cacheWrapper.set(cacheKey, stats, 3600);

    res.status(200).json({
      status: 'success',
      cached: false,
      data: stats,
    });
  } catch (error) {
    logger.error('Get movie stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics',
    });
  }
};

/**
 * Bulk import movies (Admin only)
 * @route POST /api/v1/movies/import
 * @access Private/Admin
 */
exports.importMovies = async (req, res) => {
  try {
    const movies = req.body;

    if (!Array.isArray(movies) || movies.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an array of movies to import',
      });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const movieData of movies) {
      try {
        // Add createdBy field
        movieData.createdBy = req.user._id;
        
        // Basic validation check (essential fields)
        if (!movieData.title) {
            throw new Error('Title is required');
        }

        await Movie.create(movieData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          title: movieData.title || 'Unknown',
          error: error.message,
        });
      }
    }

    // Invalidate cache
    await cacheWrapper.delPattern('movies:*');

    logger.info(`Bulk import: ${results.success} success, ${results.failed} failed by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      data: results,
    });
  } catch (error) {
    logger.error('Import movies error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to import movies',
    });
  }
};
