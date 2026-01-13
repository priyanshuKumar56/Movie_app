const mongoose = require('mongoose');
const User = require('./src/models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';

    try {
      // Check if admin exists
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (existingAdmin) {
        console.log('Admin user already exists:', adminEmail);
        existingAdmin.role = 'ADMIN'; // Ensure role is ADMIN
        existingAdmin.password = adminPassword; // Reset password to known value
        await existingAdmin.save();
        console.log('Admin updated with password:', adminPassword);
      } else {
        const newAdmin = new User({
          name: 'Super Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'ADMIN',
          isVerified: true,
          isActive: true
        });
        await newAdmin.save();
        console.log('Admin user created:', adminEmail);
      }
    } catch (err) {
      console.error('Error creating admin:', err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('Connection error:', err);
  });
