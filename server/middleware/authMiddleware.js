const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'medsathi_super_secret_jwt_key_2026_clinical_emar'
      );

      let user = null;
      if (isConnected()) {
        try {
          user = await User.findOne({ id: decoded.id }).select('-password');
        } catch (err) {
          user = null;
        }
      }

      if (!user) {
        user = mockStore.users.find(u => u.id === decoded.id) || {
          id: decoded.id,
          role: decoded.role || 'DOCTOR',
          name: 'Clinical Staff',
          email: 'staff@smartmed.com'
        };
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[Auth Middleware] Token verification notice:', error.message);
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ success: false, error: 'Authorization header with Bearer token is required' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Role '${req.user ? req.user.role : 'GUEST'}' is not authorized for this resource.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
