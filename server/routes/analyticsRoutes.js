const express = require('express');
const router = express.Router();
const { getHospitalOverview } = require('../controllers/analyticsController');

router.get('/hospital-overview', getHospitalOverview);

module.exports = router;

