const express = require('express');
const router = express.Router();
const { signup, login, getMe, getDemoUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/demo-users', getDemoUsers);

module.exports = router;

