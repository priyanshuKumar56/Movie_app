/**
 * Script to fix movies by adding status field
 */
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinesphere';

async function fixMovies() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Update all movies without status
    const result = await mongoose.connection.db.collection('movies').updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );
    
    console.log(`Updated ${result.modifiedCount} movies to have status: 'active'`);
    
    // Also update movies with isActive = true but no status
    const result2 = await mongoose.connection.db.collection('movies').updateMany(
      { isActive: true, status: { $ne: 'active' } },
      { $set: { status: 'active' } }
    );
    
    console.log(`Additional updates: ${result2.modifiedCount}`);
    
    // Count total active movies
    const count = await mongoose.connection.db.collection('movies').countDocuments({ status: 'active' });
    console.log(`Total active movies: ${count}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

fixMovies();
