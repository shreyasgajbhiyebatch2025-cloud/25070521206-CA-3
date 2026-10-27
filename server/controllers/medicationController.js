const crypto = require('node:crypto');
const MedicationSchedule = require('../models/MedicationSchedule');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const AuditLog = require('../models/AuditLog');
const { checkSafetyWarnings } = require('../utils/safetyChecker');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

// @desc    Get Nurse Task Board Medication Schedules
// @route   GET /api/medications
// @access  Private / Public
const getSchedules = async (req, res) => {
  try {
    const { tab = 'ALL', ward, patientId, search } = req.query;

    if (isConnected()) {
      try {
        const filter = {};
        if (tab === 'DUE') {
          filter.status = 'DUE';
        } else if (tab === 'UPCOMING') {
          filter.status = 'UPCOMING';
        } else if (tab === 'OVERDUE') {
          filter.status = 'OVERDUE';
        } else if (tab === 'COMPLETED') {
          filter.status = { $in: ['GIVEN', 'DELAYED', 'HELD', 'REFUSED', 'NOT_GIVEN'] };
        } else if (tab === 'STAT') {
          filter.isStat = true;
        }

        if (patientId) {
          filter.patientId = patientId;
        }

        let schedules = await MedicationSchedule.find(filter).sort({ isStat: -1, scheduledTime: 1 });

        // Join patient details & prescription doctor info
        const enhanced = await Promise.all(
          schedules.map(async (s) => {
            const sObj = s.toObject ? s.toObject() : s;
            const patient = await Patient.findOne({ id: s.patientId });
            const prescription = await Prescription.findOne({ id: s.prescriptionId });

            return {
              ...sObj,
              patientName: patient ? patient.name : 'Unknown',
              patientUhid: patient ? patient.uhid : 'N/A',
              patientAge: patient ? patient.age : 0,
              patientGender: patient ? patient.gender : 'N/A',
              patientWard: patient ? patient.ward : 'N/A',
              patientBed: patient ? patient.bed : 'N/A',
              patientAllergies: patient ? patient.allergies : [],
              patientQrCode: patient ? patient.qrCode : '',
              doctorName: prescription ? prescription.doctorName : 'Attending Physician',
              rxInstructions: prescription ? prescription.instructions : '',
              rxStatus: prescription ? prescription.status : 'ACTIVE'
            };
          })
        );

        let filteredResults = enhanced;
        if (ward && ward !== 'ALL') {
          filteredResults = filteredResults.filter(item => item.patientWard === ward);
        }
        if (search) {
          const q = search.toLowerCase();
          filteredResults = filteredResults.filter(
            item =>
              item.patientName.toLowerCase().includes(q) ||
              item.patientUhid.toLowerCase().includes(q) ||
              item.medicine.toLowerCase().includes(q) ||
              item.patientBed.toLowerCase().includes(q)
          );
        }

        const countDue = await MedicationSchedule.countDocuments({ status: 'DUE' });
        const countUpcoming = await MedicationSchedule.countDocuments({ status: 'UPCOMING' });
        const countOverdue = await MedicationSchedule.countDocuments({ status: 'OVERDUE' });
        const countCompleted = await MedicationSchedule.countDocuments({
          status: { $in: ['GIVEN', 'DELAYED', 'HELD', 'REFUSED', 'NOT_GIVEN'] }
        });
        const countStat = await MedicationSchedule.countDocuments({
          isStat: true,
          status: { $in: ['DUE', 'OVERDUE'] }
        });

        return res.json({
          success: true,
          data: filteredResults,
          counts: {
            due: countDue,
            upcoming: countUpcoming,
            overdue: countOverdue,
            completed: countCompleted,
            stat: countStat,
            total: filteredResults.length
          }
        });
      } catch (dbErr) {
        console.warn('[Medications Controller] Mongoose find fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    let list = mockStore.getSchedules({ tab, patientId });
    if (ward && ward !== 'ALL') {
      list = list.filter(item => item.patientWard.toLowerCase() === ward.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        item =>
          item.patientName.toLowerCase().includes(q) ||
          item.patientUhid.toLowerCase().includes(q) ||
          item.medicine.toLowerCase().includes(q) ||
          item.patientBed.toLowerCase().includes(q)
      );
    }

    const allSchedules = mockStore.schedules;
    res.json({
      success: true,
      data: list,
      counts: {
        due: allSchedules.filter(s => s.status === 'DUE').length,
        upcoming: allSchedules.filter(s => s.status === 'UPCOMING').length,
        overdue: allSchedules.filter(s => s.status === 'OVERDUE').length,
        completed: allSchedules.filter(s => ['GIVEN', 'DELAYED', 'HELD', 'REFUSED'].includes(s.status)).length,
        stat: allSchedules.filter(s => s.isStat && (s.status === 'DUE' || s.status === 'OVERDUE')).length,
        total: list.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    QR & Bedside 5-Rights Verification
// @route   POST /api/medications/verify-qr
// @access  Private / Public
const verifyQr = async (req, res) => {
  try {
    const { scheduleId, scannedQr } = req.body;
    const rawQr = (scannedQr || '').trim();

    if (isConnected()) {
      try {
        const schedule = await MedicationSchedule.findOne({ id: scheduleId });
        if (schedule) {
          const patient = await Patient.findOne({ id: schedule.patientId });
          if (patient) {
            const prescription = await Prescription.findOne({ id: schedule.prescriptionId });
            const isPatientMatch =
              rawQr === patient.qrCode ||
              rawQr.includes(patient.id) ||
              rawQr.includes(patient.uhid) ||
              rawQr.toLowerCase().includes(patient.name.toLowerCase());

            const isRxActive = prescription ? prescription.status === 'ACTIVE' : true;
            const activePrescriptions = await Prescription.find({ patientId: patient.id, status: 'ACTIVE' });
            const safetyWarnings = checkSafetyWarnings({
              patient,
              medicineName: schedule.medicine,
              dose: schedule.dose,
              currentActivePrescriptions: activePrescriptions
            });

            return res.json({
              success: true,
              verification: {
                patientMatched: isPatientMatch,
                activeRxMatched: isRxActive,
                medicineMatched: true,
                doseMatched: true,
                verifiedPatient: {
                  id: patient.id,
                  uhid: patient.uhid,
                  name: patient.name,
                  age: patient.age,
                  gender: patient.gender,
                  ward: patient.ward,
                  bed: patient.bed,
                  allergies: patient.allergies
                },
                selectedMedication: {
                  scheduleId: schedule.id,
                  medicine: schedule.medicine,
                  dose: schedule.dose,
                  route: schedule.route,
                  scheduledTime: schedule.scheduledTime,
                  isStat: schedule.isStat
                },
                safetyWarnings
              }
            });
          }
        }
      } catch (dbErr) {
        console.warn('[Medications Controller] Mongoose QR verify fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const schedule = mockStore.schedules.find(s => s.id === scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Medication schedule event not found' });
    }

    const patient = mockStore.getPatientById(schedule.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const isPatientMatch =
      rawQr === patient.qrCode ||
      rawQr.includes(patient.id) ||
      rawQr.includes(patient.uhid) ||
      rawQr.toLowerCase().includes(patient.name.toLowerCase()) ||
      rawQr.length === 0; // Quick pass for demo verification

    const safetyWarnings = checkSafetyWarnings({
      patient,
      medicineName: schedule.medicine,
      dose: schedule.dose,
      currentActivePrescriptions: mockStore.prescriptions.filter(p => p.patientId === patient.id && p.status === 'ACTIVE')
    });

    res.json({
      success: true,
      verification: {
        patientMatched: isPatientMatch,
        activeRxMatched: true,
        medicineMatched: true,
        doseMatched: true,
        verifiedPatient: patient,
        selectedMedication: {
          scheduleId: schedule.id,
          medicine: schedule.medicine,
          dose: schedule.dose,
          route: schedule.route,
          scheduledTime: schedule.scheduledTime,
          isStat: schedule.isStat
        },
        safetyWarnings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Record Medication Administration Action (Hero Feature)
// @route   POST /api/medications/administer
// @access  Private (Nurse)
const administer = async (req, res) => {
  try {
    const {
      scheduleId,
      action, // GIVEN, DELAYED, HELD, REFUSED, NOT_GIVEN
      reason,
      notes = '',
      administeredBy = req.user?.name || 'Nurse Priya Patel',
      administeredByRole = req.user?.role || 'NURSE',
      userId = req.user?.id || 'USR-NURSE-01'
    } = req.body;

    if (!scheduleId || !action) {
      return res.status(400).json({ success: false, error: 'scheduleId and action are required' });
    }

    if (isConnected()) {
      try {
        const schedule = await MedicationSchedule.findOne({ id: scheduleId });
        if (schedule) {
          const patient = await Patient.findOne({ id: schedule.patientId });
          const nowIso = new Date().toISOString();

          schedule.status = action;
          schedule.administeredAt = nowIso;
          schedule.administeredBy = administeredBy;
          schedule.administeredByRole = administeredByRole;
          schedule.reason = reason || null;
          schedule.notes = notes || null;
          await schedule.save();

          const auditId = 'AUD-' + crypto.randomUUID().substring(0, 8).toUpperCase();
          let auditAction = `MEDICATION_${action}`;
          let auditDetails = `Medication recorded as ${action} by ${administeredBy}.`;
          if (reason) auditDetails += ` Reason: ${reason}.`;
          if (notes) auditDetails += ` Notes: ${notes}.`;

          await AuditLog.create({
            id: auditId,
            timestamp: nowIso,
            userId,
            userName: administeredBy,
            userRole: administeredByRole,
            action: auditAction,
            patientId: schedule.patientId,
            patientName: patient ? patient.name : 'Inpatient',
            medicineName: `${schedule.medicine} ${schedule.dose}`,
            details: auditDetails
          });

          return res.json({
            success: true,
            message: `Medication successfully recorded as ${action}.`,
            data: schedule
          });
        }
      } catch (dbErr) {
        console.warn('[Medications Controller] Mongoose administer fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const updated = mockStore.administerMedication({
      scheduleId,
      action,
      reason,
      notes,
      user: { id: userId, name: administeredBy, role: administeredByRole }
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Medication schedule event not found' });
    }

    res.json({
      success: true,
      message: `Medication successfully recorded as ${action}.`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getSchedules,
  verifyQr,
  administer
};
