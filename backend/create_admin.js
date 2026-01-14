const mongoose = require('mongoose');
const User = require('./src/models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get credentials from arguments or use defaults
    const adminEmail = process.argv[2] || 'admin@movieapp.com';
    const adminPassword = process.argv[3] || 'admin123';
    const adminName = process.argv[4] || 'System Admin';

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
      existingAdmin.role = 'ADMIN';
      existingAdmin.password = adminPassword;
      existingAdmin.isVerified = true;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('✅ Admin updated successfully');
    } else {
      const newAdmin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        isVerified: true,
        isActive: true
      });
      await newAdmin.save();
      console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();
