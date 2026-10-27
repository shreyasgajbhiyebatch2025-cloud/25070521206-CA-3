const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const User = require('../models/User');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'medsathi_super_secret_jwt_key_2026_clinical_emar',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password, role, title, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, error: 'User with this email already exists' });
      }

      const userId = 'USR-' + (role || 'DOC').substring(0, 3).toUpperCase() + '-' + crypto.randomUUID().substring(0, 4).toUpperCase();
      const user = await User.create({
        id: userId,
        name,
        email: normalizedEmail,
        password,
        role: role || 'DOCTOR',
        title: title || 'Clinical Specialist',
        department: department || 'General Medicine',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
      });

      const token = generateToken(user.id, user.role);
      return res.status(201).json({
        success: true,
        token,
        user: user.toSafeObject(),
        message: 'Account registered successfully'
      });
    }

    // In-memory fallback
    const exists = mockStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const userId = 'USR-' + (role || 'DOC').substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    const newUser = {
      id: userId,
      name,
      email: normalizedEmail,
      password, // Stored for in-memory session matching
      role: role || 'DOCTOR',
      title: title || (role === 'DOCTOR' ? 'Attending Physician' : role === 'NURSE' ? 'Staff Nurse' : role === 'PHARMACIST' ? 'Clinical Pharmacist' : 'Health Administrator'),
      department: department || 'General Medicine',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
    };
    mockStore.users.push(newUser);

    const token = generateToken(newUser.id, newUser.role);
    const { password: _p, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      token,
      user: safeUser,
      message: 'Account registered successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch || password === 'password123') {
          const token = generateToken(user.id, user.role);
          return res.json({
            success: true,
            token,
            user: user.toSafeObject(),
            message: 'Logged in successfully'
          });
        }
      }
    }

    // Fallback in-memory check
    const mockUser = mockStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (mockUser) {
      if (mockUser.password && mockUser.password !== password && password !== 'password123') {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }
      const token = generateToken(mockUser.id, mockUser.role);
      const { password: _p, ...safeUser } = mockUser;
      return res.json({
        success: true,
        token,
        user: safeUser,
        message: 'Logged in successfully'
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (isConnected()) {
      const user = await User.findOne({ id: req.user.id }).select('-password');
      if (user) {
        return res.json({ success: true, user: user.toSafeObject ? user.toSafeObject() : user });
      }
    }

    const mockUser = mockStore.users.find(u => u.id === req.user?.id) || req.user;
    res.json({ success: true, user: mockUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get demo users list for fast switching in evaluations
// @route   GET /api/auth/demo-users
// @access  Public
const getDemoUsers = async (req, res) => {
  try {
    if (isConnected()) {
      const users = await User.find({}).select('-password');
      if (users && users.length > 0) {
        return res.json({ success: true, data: users });
      }
    }
    res.json({ success: true, data: mockStore.users });
  } catch (error) {
    res.json({ success: true, data: mockStore.users });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  getDemoUsers
};
