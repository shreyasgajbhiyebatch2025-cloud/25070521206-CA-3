const express = require('express');
const router = express.Router();
const { predictDelayRisk } = require('../controllers/aiRiskController');

router.get('/predict', predictDelayRisk);

module.exports = router;

