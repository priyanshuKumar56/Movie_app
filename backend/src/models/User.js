const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'MODERATOR'],
      default: 'USER',
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    // Netflix-level features
    watchHistory: [
      {
        movie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Movie',
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    preferences: {
      genres: [String],
      language: {
        type: String,
        default: 'en',
      },
      autoplay: {
        type: Boolean,
        default: true,
      },
      quality: {
        type: String,
        enum: ['auto', 'low', 'medium', 'high', '4k'],
        default: 'auto',
      },
    },
    // Security
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshToken: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES
// ============================================

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// ============================================
// VIRTUALS
// ============================================

// Check if account is locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ============================================
// MIDDLEWARE
// ============================================

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

// ============================================
// METHODS
// ============================================

/**
 * Compare password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT access token
 */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * Generate JWT refresh token
 */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    }
  );
};

/**
 * Check if password was changed after token was issued
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Increment login attempts
 */
userSchema.methods.incLoginAttempts = async function () {
  // If lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;

  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + parseInt(process.env.LOCK_TIME) || 3600000 };
  }

  return await this.updateOne(updates);
};

/**
 * Reset login attempts
 */
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

/**
 * Add to watch history
 */
userSchema.methods.addToWatchHistory = async function (movieId, progress = 0) {
  const existingIndex = this.watchHistory.findIndex(
    (item) => item.movie.toString() === movieId.toString()
  );

  if (existingIndex !== -1) {
    this.watchHistory[existingIndex].watchedAt = Date.now();
    this.watchHistory[existingIndex].progress = progress;
  } else {
    this.watchHistory.unshift({
      movie: movieId,
      watchedAt: Date.now(),
      progress,
    });
    // Keep only last 100 items
    if (this.watchHistory.length > 100) {
      this.watchHistory = this.watchHistory.slice(0, 100);
    }
  }

  await this.save();
  return this;
};

/**
 * Add to favorites
 */
userSchema.methods.addToFavorites = async function (movieId) {
  if (!this.favorites.includes(movieId)) {
    this.favorites.push(movieId);
    await this.save();
  }
  return this;
};

/**
 * Remove from favorites
 */
userSchema.methods.removeFromFavorites = async function (movieId) {
  this.favorites = this.favorites.filter((id) => id.toString() !== movieId.toString());
  await this.save();
  return this;
};

/**
 * Add to watchlist
 */
userSchema.methods.addToWatchlist = async function (movieId) {
  if (!this.watchlist.includes(movieId)) {
    this.watchlist.push(movieId);
    await this.save();
  }
  return this;
};

/**
 * Remove from watchlist
 */
userSchema.methods.removeFromWatchlist = async function (movieId) {
  this.watchlist = this.watchlist.filter((id) => id.toString() !== movieId.toString());
  await this.save();
  return this;
};

// ============================================
// STATICS
// ============================================

/**
 * Find user by credentials
 */
userSchema.statics.findByCredentials = async function (email, password) {
  // Normalize email to ensure case-insensitive matching
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  
  const user = await this.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.isLocked) {
    throw new Error('Account is locked. Please try again later.');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    await user.incLoginAttempts();
    throw new Error('Invalid credentials');
  }

  await user.resetLoginAttempts();
  user.lastLogin = Date.now();
  await user.save();

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
