/**
 * Import movies from JSON file into MongoDB.
 *
 * Usage:
 *   1) Make sure MongoDB is running and MONGODB_URI is set in backend/.env
 *   2) From the backend folder run:
 *
 *        node src/scripts/importMoviesFromJson.js
 *
 *   This will:
 *     - delete ALL existing movies
 *     - insert all movies from src/Imdb_DataSet/movies_data.json
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('../models/Movie');

// Use the same default as the main app
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movieapp';

// Path to the JSON dataset
const DATA_FILE_PATH = path.join(__dirname, '..', 'Imdb_DataSet', 'movies_data.json');

async function importMovies() {
  console.log('\n🚀 Importing movies from JSON file');
  console.log('='.repeat(60));

  try {
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Read JSON file
    console.log(`📄 Reading data from: ${DATA_FILE_PATH}`);
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const movies = JSON.parse(raw);

    if (!Array.isArray(movies) || movies.length === 0) {
      throw new Error('JSON file does not contain a non-empty array of movies');
    }

    console.log(`📊 Loaded ${movies.length} movies from JSON\n`);

    // Optional: set createdBy/updatedBy to a specific admin ID
    // If you have an admin user ID, you can put it here (24-char Mongo ObjectId string)
    const ADMIN_ID = process.env.ADMIN_USER_ID || "6965eb4424be86cdb1f0eed5";
    if (ADMIN_ID) {
      console.log(`👤 Using ADMIN_USER_ID from env for createdBy/updatedBy: ${ADMIN_ID}\n`);
      movies.forEach((movie) => {
        movie.createdBy = ADMIN_ID;
        movie.updatedBy = ADMIN_ID;
      });
    }

    // Clear existing data
    console.log('🧹 Deleting all existing movies from the database...');
    const deleteResult = await Movie.deleteMany({});
    console.log(`   Removed ${deleteResult.deletedCount} existing movies\n`);

    // Ensure status is set
    movies.forEach((movie) => {
      if (!movie.status) {
        movie.status = 'active';
      }
    });

    // Insert new movies
    console.log('💾 Inserting movies from JSON into the database...');
    const inserted = await Movie.insertMany(movies, { ordered: false });
    console.log(`✅ Successfully inserted ${inserted.length} movies\n`);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB\n');
  }
}

importMovies();

