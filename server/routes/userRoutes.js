const express = require('express');
const router = express.Router();
const User = require('../userModel');

// הרשמת משתמש רגיל
router.post('/signup', async (req, res) => {
    const { username, password, instrument } = req.body;
  
    const role = instrument === 'vocals' ? 'singer' : 'player';
  
    try {
      const newUser = new User({
        username,
        password,
        instrument,
        role,
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// הרשמת אדמין
router.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newAdmin = new User({
      username,
      password,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', user: newAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// התחברות משתמש
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
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
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
