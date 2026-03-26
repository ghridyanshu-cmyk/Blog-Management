const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        errors: ['Email is already registered. Please login or use a different email.'] 
      });
    }

    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password 
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please login.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, errors });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        errors: ['Email is already registered. Please login or use a different email.'] 
      });
    }

    res.status(500).json({ 
      success: false, 
      errors: ['An error occurred. Please try again later.'] 
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Check if user exists and password matches
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        errors: ['Invalid email or password'] 
      });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false, 
        errors: ['Invalid email or password'] 
      });
    }

    res.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      errors: ['An error occurred. Please try again later.'] 
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};