// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../userModel');

// ==============================
// Route: POST /signup
// Description: Register a new regular user (player or singer)
// ==============================
router.post('/signup', async (req, res) => {
  const { username, password, instrument } = req.body;

  // Determine user role based on instrument type
  const role = instrument === 'vocals' ? 'singer' : 'player';

  try {
    const newUser = new User({
      username,
      password,
      instrument,
      role,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    // Handle duplicate usernames
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    res.status(500).json({ error: 'Signup failed. Please try again later.' });
  }
});

// ==============================
// Route: POST /admin/signup
// Description: Register a new admin user
// ==============================
router.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newAdmin = new User({
      username,
      password,
      role: 'admin', // Explicitly set the role to admin
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', user: newAdmin });
  } catch (err) {
    // Handle duplicate usernames
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    res.status(500).json({ error: 'Admin signup failed. Please try again later.' });
  }
});

// ==============================
// Route: POST /login
// Description: Authenticate a user and return user details
// ==============================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Look up the user by username
    const user = await User.findOne({ username });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return basic user info without password
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        instrument: user.instrument || null,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed. Please try again later.' });
  }
});

module.exports = router;
