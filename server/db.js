const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// MongoDB connection string from environment
const uri = process.env.MONGO_URI;

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    // Attempt to connect with recommended options
    await mongoose.connect(uri, {
      useNewUrlParser: true,      // Use the new URL string parser
      useUnifiedTopology: true,  // Use the new server discovery and monitoring engine
    });

    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    // Log error and exit process if connection fails
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
