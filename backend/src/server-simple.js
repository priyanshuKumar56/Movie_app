// Simple test to verify Express is working
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server without waiting for anything
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinesphere')
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Import routes after connection
    const authRoutes = require('./routes/authRoutes');
    const movieRoutes = require('./routes/movieRoutes');
    
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/movies', movieRoutes);
    
    // Error handler
    app.use((err, req, res, next) => {
      console.error('Error:', err.message);
      res.status(500).json({ error: err.message });
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
