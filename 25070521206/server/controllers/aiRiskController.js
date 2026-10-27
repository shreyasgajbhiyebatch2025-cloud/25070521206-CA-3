const MedicationSchedule = require('../models/MedicationSchedule');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

// @desc    Heuristic Medication Delay Risk Prediction Engine
// @route   GET /api/ai-risk/predict
// @access  Public / Private
const predictDelayRisk = async (req, res) => {
  try {
    const { patientId, medicineName, ward } = req.query;
    const targetWard = ward || 'General Ward';

    let pendingInWard = 3;
    let activeMedsCount = 2;

    if (isConnected()) {
      try {
        const patientsInWard = await Patient.find({ ward: targetWard }).select('id');
        const patientIds = patientsInWard.map(p => p.id);

        pendingInWard = await MedicationSchedule.countDocuments({
          patientId: { $in: patientIds },
          status: { $in: ['DUE', 'OVERDUE'] }
        });

        if (patientId) {
          const activeRx = await Prescription.countDocuments({
            patientId,
            status: 'ACTIVE'
          });
          if (activeRx) activeMedsCount = activeRx;
        }
      } catch (dbErr) {
        console.warn('[AI Risk Controller] Mongoose predict fallback:', dbErr.message);
      }
    } else {
      const pIds = mockStore.patients.filter(p => p.ward === targetWard).map(p => p.id);
      pendingInWard = mockStore.schedules.filter(s => pIds.includes(s.patientId) && ['DUE', 'OVERDUE'].includes(s.status)).length;
      if (patientId) {
        activeMedsCount = mockStore.prescriptions.filter(rx => rx.patientId === patientId && rx.status === 'ACTIVE').length || 2;
      }
    }

    let score = 25;
    const factors = [];

    if (pendingInWard > 4) {
      score += 28;
      factors.push(`High medication workload in ${targetWard} (${pendingInWard} pending doses currently active)`);
    } else if (pendingInWard > 1) {
      score += 15;
      factors.push(`Moderate nursing task density in ${targetWard}`);
    }

    if (activeMedsCount >= 3) {
      score += 20;
      factors.push(`Polypharmacy: Patient currently has ${activeMedsCount} active concurrent prescriptions`);
    }

    const normalizedMed = (medicineName || '').toLowerCase();
    if (normalizedMed.includes('meropenem') || normalizedMed.includes('furosemide') || normalizedMed.includes('noradrenaline')) {
      score += 18;
      factors.push('IV Infusion protocol requiring precise rate titration and vascular access check');
    }

    const currentHour = new Date().getHours();
    if ((currentHour >= 8 && currentHour <= 10) || (currentHour >= 18 && currentHour <= 20)) {
      score += 12;
      factors.push('Scheduled during morning/evening peak medication round changeover');
    }

    score = Math.min(94, Math.max(15, score));
    const riskLevel = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

    res.json({
      success: true,
      disclaimer: 'Decision-support prototype — not a clinical decision. Final medical workflow managed by healthcare staff.',
      data: {
        riskScore: score,
        riskLevel,
        riskBadgeColor: riskLevel === 'HIGH' ? 'red' : riskLevel === 'MEDIUM' ? 'amber' : 'green',
        factors,
        recommendation:
          riskLevel === 'HIGH'
            ? 'Prioritize patient in upcoming medication round or prepare IV supplies in advance.'
            : 'Standard medication round scheduling applies.'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  predictDelayRisk
};
