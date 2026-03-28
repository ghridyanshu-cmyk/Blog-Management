const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // FETCH NAME HERE: Ensure the name field is included
      req.user = await User.findById(decoded.id).select('name email isAdmin');

      if (!req.user) {
        return res.status(401).json({ success: false, errors: ['User not found'] });
      }

      next();
    } catch (error) {
      res.status(401).json({ success: false, errors: ['Not authorized, token failed'] });
    }
  } else {
    res.status(401).json({ success: false, errors: ['Not authorized, no token'] });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ success: false, errors: ['Not authorized as an admin'] });
  }
};

module.exports = { protect, admin };