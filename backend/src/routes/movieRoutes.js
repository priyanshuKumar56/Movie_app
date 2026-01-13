const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const movieController = require('../controllers/movieController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

// Validation rules
const movieValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('rating').isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('releaseDate').isISO8601().withMessage('Valid release date is required'),
  body('genres').isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('posterUrl').trim().isURL().withMessage('Valid poster URL is required'),
];

// Public routes
router.get('/', optionalAuth, movieController.getAllMovies);
router.get('/search', optionalAuth, movieController.searchMovies);
router.get('/trending', optionalAuth, movieController.getTrendingMovies);
router.get('/stats', movieController.getMovieStats);
router.get('/genre/:genre', optionalAuth, movieController.getMoviesByGenre);
router.get('/:id', optionalAuth, movieController.getMovieById);

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  movieValidation,
  movieController.createMovie
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  movieController.updateMovie
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  movieController.deleteMovie
);

module.exports = router;
