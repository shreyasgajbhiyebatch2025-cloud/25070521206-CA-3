const express = require('express');
const router = express.Router();
const {
  getSchedules,
  verifyQr,
  administer
} = require('../controllers/medicationController');

router.get('/', getSchedules);
router.post('/verify-qr', verifyQr);
router.post('/administer', administer);

module.exports = router;

