const express = require('express');
const router = express.Router();
const {
  previewSchedule,
  checkSafety,
  getPrescriptions,
  createPrescription,
  stopPrescription,
  updatePrescription
} = require('../controllers/prescriptionController');

router.get('/', getPrescriptions);
router.post('/preview-schedule', previewSchedule);
router.post('/safety-check', checkSafety);
router.post('/', createPrescription);
router.post('/:id/stop', stopPrescription);
router.put('/:id', updatePrescription);

module.exports = router;

