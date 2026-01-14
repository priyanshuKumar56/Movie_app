const mongoose = require('mongoose');
const Movie = require('./src/models/Movie');
const User = require('./src/models/User');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const importMovies = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(mongoUri);
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Path to dataset
    const datasetPath = path.resolve(__dirname, 'src', 'Imdb_DataSet', 'movies_data.json');
    if (!fs.existsSync(datasetPath)) {
      console.error(`❌ Dataset not found at: ${datasetPath}`);
      process.exit(1);
    }

    const moviesData = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
    console.log(`📊 Found ${moviesData.length} movies in dataset`);

    // Get an admin user ID for createdBy/updatedBy
    const adminUser = await User.findOne({ role: 'ADMIN' });
    const adminId = adminUser ? adminUser._id : null;

    if (!adminId) {
      console.warn('⚠️  No admin user found. Running createAdmin script first is recommended.');
    }

    // Clean data before import
    const sanitizedMovies = moviesData.map(movie => {
      // Remove fields that might cause issues or need to be system generated
      const { _id, createdBy, updatedBy, ...movieData } = movie;
      
      // Assign admin as creator if available
      if (adminId) {
        movieData.createdBy = adminId;
        movieData.updatedBy = adminId;
      }
      
      return movieData;
    });

    console.log('🧹 Items sanitized. Starting import...');

    // Clear existing movies? (Optional, let's just insert many and handle duplicates via unique indexes like imdbId)
    // await Movie.deleteMany({}); // Uncomment if you want to wipe collection first

    let successCount = 0;
    let errorCount = 0;

    for (const movie of sanitizedMovies) {
      try {
        // Use findOneAndUpdate with upsert to avoid duplicates and update existing ones
        await Movie.findOneAndUpdate(
          { imdbId: movie.imdbId },
          movie,
          { upsert: true, new: true, runValidators: true }
        );
        successCount++;
      } catch (err) {
        console.error(`❌ Error importing "${movie.title}":`, err.message);
        errorCount++;
      }
    }

    console.log(`\n✨ Import Complete!`);
    console.log(`✅ Successfully imported/updated: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);

  } catch (err) {
    console.error('❌ Critical Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

importMovies();
