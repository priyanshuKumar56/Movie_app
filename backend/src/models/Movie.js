const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Movie rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10'],
      index: true,
    },
    duration: {
      type: Number,
      required: [true, 'Movie duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
      index: true,
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one genre must be specified',
      },
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster URL is required'],
      trim: true,
    },
    backdropUrl: {
      type: String,
      trim: true,
    },
    trailerUrl: {
      type: String,
      trim: true,
    },
    director: {
      type: String,
      trim: true,
    },
    cast: [
      {
        name: String,
        character: String,
        profileUrl: String,
      },
    ],
    imdbId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    tmdbId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    language: {
      type: String,
      default: 'English',
    },
    country: {
      type: String,
      default: 'USA',
    },
    budget: {
      type: Number,
      min: 0,
    },
    revenue: {
      type: Number,
      min: 0,
    },
    // Netflix-level features
    viewCount: {
      type: Number,
      default: 0,
      index: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    trending: {
      type: Boolean,
      default: false,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES FOR PERFORMANCE
// ============================================

// Text index for search functionality
movieSchema.index({ title: 'text', description: 'text' });

// Compound indexes for common queries
movieSchema.index({ rating: -1, releaseDate: -1 });
movieSchema.index({ trending: 1, trendingScore: -1 });
movieSchema.index({ genres: 1, rating: -1 });
movieSchema.index({ status: 1, createdAt: -1 });

// ============================================
// VIRTUALS
// ============================================

// Virtual for release year
movieSchema.virtual('releaseYear').get(function () {
  return this.releaseDate ? this.releaseDate.getFullYear() : null;
});

// Virtual for formatted duration (e.g., "2h 28m")
movieSchema.virtual('formattedDuration').get(function () {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// ============================================
// METHODS
// ============================================

/**
 * Increment view count
 */
movieSchema.methods.incrementViews = async function () {
  this.viewCount += 1;
  await this.save();
  return this;
};

/**
 * Calculate trending score based on views and recency
 */
movieSchema.methods.calculateTrendingScore = function () {
  const daysSinceRelease = Math.floor(
    (Date.now() - this.releaseDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyFactor = Math.max(0, 1 - daysSinceRelease / 365);
  this.trendingScore = this.viewCount * 0.7 + this.rating * 10 * 0.3 + recencyFactor * 100;
  return this.trendingScore;
};

// ============================================
// STATICS
// ============================================

/**
 * Get trending movies
 */
movieSchema.statics.getTrending = async function (limit = 10) {
  return this.find({ status: 'active' })
    .sort({ trendingScore: -1, viewCount: -1 })
    .limit(limit)
    .select('-__v');
};

/**
 * Get featured movies
 */
movieSchema.statics.getFeatured = async function (limit = 5) {
  return this.find({ featured: true, status: 'active' })
    .sort({ rating: -1 })
    .limit(limit)
    .select('-__v');
};

/**
 * Search movies with fuzzy matching
 */
movieSchema.statics.searchMovies = async function (query, options = {}) {
  const { page = 1, limit = 20, sort = '-rating' } = options;
  const skip = (page - 1) * limit;

  const searchQuery = {
    $text: { $search: query },
    status: 'active',
  };

  const movies = await this.find(searchQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const total = await this.countDocuments(searchQuery);

  return {
    movies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get movies by genre
 */
movieSchema.statics.getByGenre = async function (genre, options = {}) {
  const { page = 1, limit = 20, sort = '-rating' } = options;
  const skip = (page - 1) * limit;

  const movies = await this.find({ genres: genre, status: 'active' })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const total = await this.countDocuments({ genres: genre, status: 'active' });

  return {
    movies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// ============================================
// MIDDLEWARE
// ============================================

// Update trending score before saving
movieSchema.pre('save', function (next) {
  if (this.isModified('viewCount') || this.isModified('rating')) {
    this.calculateTrendingScore();
  }
  next();
});

// ============================================
// MODEL
// ============================================

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
