const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

// Verifies JWT and attaches the authenticated user to req.user
const protect = async (req, res, next) => {
  try {
    let token;

    // Expecting header format: "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Fetch fresh user data (not just what's in the token) — ensures we catch
    // deactivated accounts or deleted users even if their old token is still valid
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user no longer exists',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Contact admin.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Covers invalid signature, malformed token, and expired token cases
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired, please log in again',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }
};

// Restricts access to specific roles — must be used AFTER protect
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: requires role(s) ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };