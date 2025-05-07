const mongoose = require('mongoose');

// Define the schema structure for users in the database
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique identifier for login
  password: { type: String, required: true },               // User's password (should be hashed in production)
  instrument: { type: String },                             // Optional: instrument name (for players/singers)
  role: {                                                   // Defines user permissions/experience
    type: String,
    enum: ['admin', 'player', 'singer'],
    required: true,
  },
});

// Export the User model to use in routes and controllers
module.exports = mongoose.model('User', userSchema);
