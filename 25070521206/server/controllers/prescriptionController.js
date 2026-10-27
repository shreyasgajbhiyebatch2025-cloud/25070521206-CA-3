const crypto = require('node:crypto');
const Prescription = require('../models/Prescription');
const MedicationSchedule = require('../models/MedicationSchedule');
const Patient = require('../models/Patient');
const AuditLog = require('../models/AuditLog');
const { generateScheduleEvents } = require('../utils/scheduler');
const { checkSafetyWarnings } = require('../utils/safetyChecker');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

// @desc    Calculate preview of dosing times without saving
// @route   POST /api/prescriptions/preview-schedule
// @access  Public / Private
const previewSchedule = (req, res) => {
  try {
    const { frequency, durationDays, startDate, startTime, isStat, medicine, dose, route } = req.body;
    const dummyRx = {
      id: 'PREVIEW',
      patientId: 'PREVIEW',
      medicine: medicine || 'Selected Drug',
      dose: dose || 'Standard Dose',
      route: route || 'Oral',
      frequency: frequency || 'TDS',
      durationDays: Number(durationDays) || 5,
      startDate: startDate || new Date().toISOString().split('T')[0],
      startTime: startTime || '08:00',
      isStat: Boolean(isStat)
    };

    const events = generateScheduleEvents(dummyRx);
    res.json({
      success: true,
      totalEvents: events.length,
      events: events.map(e => ({
        scheduledTime: e.scheduledTime,
        status: e.status,
        dose: e.dose,
        route: e.route
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Clinical rule-based allergy & duplication safety check
// @route   POST /api/prescriptions/safety-check
// @access  Public / Private
const checkSafety = async (req, res) => {
  try {
    const { patientId, medicine, dose } = req.body;

    if (isConnected()) {
      try {
        const patient = await Patient.findOne({ $or: [{ id: patientId }, { uhid: patientId }] });
        if (patient) {
          const activePrescriptions = await Prescription.find({ patientId: patient.id, status: 'ACTIVE' });
          const warnings = checkSafetyWarnings({
            patient,
            medicineName: medicine,
            dose,
            currentActivePrescriptions: activePrescriptions
          });
          return res.json({ success: true, warnings });
        }
      } catch (dbErr) {
        console.warn('[Prescriptions Controller] Mongoose safety check fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const patient = mockStore.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const activePrescriptions = mockStore.prescriptions.filter(p => p.patientId === patient.id && p.status === 'ACTIVE');
    const warnings = checkSafetyWarnings({
      patient,
      medicineName: medicine,
      dose,
      currentActivePrescriptions: activePrescriptions
    });

    res.json({ success: true, warnings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all prescriptions (with filters)
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
  try {
    const { patientId, status } = req.query;

    if (isConnected()) {
      try {
        const filter = {};
        if (patientId) filter.patientId = patientId;
        if (status && status !== 'ALL') filter.status = status;

        const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });

        const enhanced = await Promise.all(
          prescriptions.map(async (rx) => {
            const rxObj = rx.toObject ? rx.toObject() : rx;
            const patient = await Patient.findOne({ id: rx.patientId });
            const totalDoses = await MedicationSchedule.countDocuments({ prescriptionId: rx.id });
            const administeredDoses = await MedicationSchedule.countDocuments({ prescriptionId: rx.id, status: 'GIVEN' });
            const pendingDoses = await MedicationSchedule.countDocuments({
              prescriptionId: rx.id,
              status: { $in: ['DUE', 'UPCOMING', 'OVERDUE'] }
            });

            return {
              ...rxObj,
              patientName: patient ? patient.name : 'Unknown',
              patientUhid: patient ? patient.uhid : 'N/A',
              patientWard: patient ? patient.ward : 'N/A',
              patientBed: patient ? patient.bed : 'N/A',
              patientAllergies: patient ? patient.allergies : [],
              totalDoses,
              administeredDoses,
              pendingDoses
            };
          })
        );

        return res.json({ success: true, count: enhanced.length, data: enhanced });
      } catch (dbErr) {
        console.warn('[Prescriptions Controller] Mongoose getPrescriptions fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const list = mockStore.getPrescriptions({ patientId, status });
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create Prescription & Automatically Generate Schedule
// @route   POST /api/prescriptions
// @access  Private (Doctor)
const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      doctorId = req.user?.id || 'USR-DOC-01',
      doctorName = req.user?.name || 'Dr. Rajesh Sharma',
      medicine,
      dose,
      route = 'Oral',
      frequency = 'TDS',
      durationDays = 5,
      startDate,
      startTime = '08:00',
      instructions = '',
      isStat = false
    } = req.body;

    if (!patientId || !medicine || !dose) {
      return res.status(400).json({ success: false, error: 'Patient, Medicine, and Dose are required.' });
    }

    if (isConnected()) {
      try {
        const patient = await Patient.findOne({ $or: [{ id: patientId }, { uhid: patientId }] });
        if (patient) {
          const rxId = 'RX-' + crypto.randomUUID().substring(0, 6).toUpperCase();
          const startDt = startDate || new Date().toISOString().split('T')[0];
          const isStatBool = Boolean(isStat || frequency === 'STAT');

          const newRx = await Prescription.create({
            id: rxId,
            patientId: patient.id,
            doctorId,
            doctorName,
            medicine,
            dose,
            route,
            frequency,
            durationDays: Number(durationDays) || 1,
            startDate: startDt,
            startTime,
            instructions,
            isStat: isStatBool,
            status: 'ACTIVE'
          });

          const scheduleEvents = generateScheduleEvents({
            id: rxId,
            patientId: patient.id,
            medicine,
            dose,
            route,
            frequency,
            durationDays: Number(durationDays) || 1,
            startDate: startDt,
            startTime,
            isStat: isStatBool
          });

          await MedicationSchedule.insertMany(scheduleEvents);

          const auditId = 'AUD-' + crypto.randomUUID().substring(0, 8).toUpperCase();
          const auditAction = isStatBool ? 'STAT_ORDER_ISSUED' : 'PRESCRIPTION_CREATED';
          const auditDetails = isStatBool
            ? `STAT emergency order created for ${medicine} (${dose}, ${route}). 1 immediate schedule event generated.`
            : `Created prescription: ${medicine} ${dose} via ${route}, ${frequency} for ${durationDays} days. ${scheduleEvents.length} schedule events automatically generated.`;

          await AuditLog.create({
            id: auditId,
            userId: doctorId,
            userName: doctorName,
            userRole: 'DOCTOR',
            action: auditAction,
            patientId: patient.id,
            patientName: patient.name,
            medicineName: `${medicine} ${dose}`,
            details: auditDetails
          });

          return res.status(201).json({
            success: true,
            message: `Prescription saved and ${scheduleEvents.length} medication schedule events generated.`,
            data: {
              prescription: newRx,
              scheduleCount: scheduleEvents.length,
              scheduleEvents
            }
          });
        }
      } catch (dbErr) {
        console.warn('[Prescriptions Controller] Mongoose createPrescription fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const result = mockStore.createPrescription(
      {
        patientId,
        medicine,
        dose,
        route,
        frequency,
        durationDays,
        startDate,
        startTime,
        instructions,
        isStat
      },
      { id: doctorId, name: doctorName }
    );

    mockStore.addAuditLog({
      userId: doctorId,
      userName: doctorName,
      userRole: 'DOCTOR',
      action: isStat ? 'STAT_ORDER_ISSUED' : 'PRESCRIPTION_CREATED',
      patientId,
      patientName: mockStore.getPatientById(patientId)?.name || 'Inpatient',
      medicineName: `${medicine} ${dose}`,
      details: `Prescription issued for ${medicine} (${dose}, ${route}, ${frequency}). Schedule generated.`
    });

    res.status(201).json({
      success: true,
      message: `Prescription saved and ${result.schedules.length} medication schedule events generated.`,
      data: {
        prescription: result.prescription,
        scheduleCount: result.schedules.length,
        scheduleEvents: result.schedules
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Stop prescription with clinical reason & preserve history
// @route   POST /api/prescriptions/:id/stop
// @access  Private (Doctor)
const stopPrescription = async (req, res) => {
  try {
    const { stoppedReason = 'Clinical review / Course completed', stoppedBy = req.user?.name || 'Dr. Rajesh Sharma', userId = req.user?.id || 'USR-DOC-01' } = req.body;

    if (isConnected()) {
      try {
        const rx = await Prescription.findOne({ id: req.params.id });
        if (rx) {
          const patient = await Patient.findOne({ id: rx.patientId });
          const now = new Date();

          rx.status = 'STOPPED';
          rx.stoppedReason = stoppedReason;
          rx.stoppedBy = stoppedBy;
          rx.stoppedAt = now;
          await rx.save();

          await MedicationSchedule.updateMany(
            { prescriptionId: rx.id, status: { $in: ['DUE', 'UPCOMING', 'OVERDUE'] } },
            { $set: { status: 'NOT_GIVEN', reason: `Discontinued by Doctor: ${stoppedReason}`, notes: 'Prescription stopped by physician' } }
          );

          const auditId = 'AUD-' + crypto.randomUUID().substring(0, 8).toUpperCase();
          await AuditLog.create({
            id: auditId,
            userId,
            userName: stoppedBy,
            userRole: 'DOCTOR',
            action: 'PRESCRIPTION_STOPPED',
            patientId: patient ? patient.id : rx.patientId,
            patientName: patient ? patient.name : 'Unknown Patient',
            medicineName: `${rx.medicine} ${rx.dose}`,
            details: `Prescription stopped. Rationale: ${stoppedReason}`
          });

          return res.json({
            success: true,
            message: `Prescription ${rx.id} stopped. Remaining scheduled doses discontinued.`
          });
        }
      } catch (dbErr) {
        console.warn('[Prescriptions Controller] Mongoose stop fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const stopped = mockStore.stopPrescription(req.params.id, stoppedReason, { id: userId, name: stoppedBy });
    if (!stopped) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    mockStore.addAuditLog({
      userId,
      userName: stoppedBy,
      userRole: 'DOCTOR',
      action: 'PRESCRIPTION_STOPPED',
      patientId: stopped.patientId,
      patientName: mockStore.getPatientById(stopped.patientId)?.name || 'Inpatient',
      medicineName: stopped.medicine,
      details: `Prescription stopped. Rationale: ${stoppedReason}`
    });

    res.json({
      success: true,
      message: `Prescription ${stopped.id} stopped. Remaining scheduled doses discontinued.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Edit Prescription (Dose / Frequency change)
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor)
const updatePrescription = async (req, res) => {
  try {
    const { dose, frequency, instructions, updatedBy = req.user?.name || 'Dr. Rajesh Sharma', userId = req.user?.id || 'USR-DOC-01' } = req.body;

    if (isConnected()) {
      try {
        const rx = await Prescription.findOne({ id: req.params.id });
        if (rx) {
          const patient = await Patient.findOne({ id: rx.patientId });
          const oldDetails = `Old: ${rx.dose}, ${rx.frequency}`;
          const newDetails = `New: ${dose || rx.dose}, ${frequency || rx.frequency}`;

          rx.dose = dose || rx.dose;
          rx.frequency = frequency || rx.frequency;
          rx.instructions = instructions !== undefined ? instructions : rx.instructions;
          rx.status = 'MODIFIED';
          await rx.save();

          if (dose) {
            await MedicationSchedule.updateMany(
              { prescriptionId: rx.id, status: { $in: ['DUE', 'UPCOMING'] } },
              { $set: { dose } }
            );
          }

          const auditId = 'AUD-' + crypto.randomUUID().substring(0, 8).toUpperCase();
          await AuditLog.create({
            id: auditId,
            userId,
            userName: updatedBy,
            userRole: 'DOCTOR',
            action: 'PRESCRIPTION_MODIFIED',
            patientId: patient ? patient.id : rx.patientId,
            patientName: patient ? patient.name : 'Unknown Patient',
            medicineName: rx.medicine,
            details: `Prescription modified. ${oldDetails} → ${newDetails}. Reason: Clinical adjustment.`
          });

          return res.json({ success: true, message: 'Prescription updated successfully.', data: rx });
        }
      } catch (dbErr) {
        console.warn('[Prescriptions Controller] Mongoose update fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const rx = mockStore.prescriptions.find(r => r.id === req.params.id);
    if (!rx) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    if (dose) rx.dose = dose;
    if (frequency) rx.frequency = frequency;
    if (instructions !== undefined) rx.instructions = instructions;
    rx.status = 'MODIFIED';

    res.json({ success: true, message: 'Prescription updated successfully.', data: rx });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  previewSchedule,
  checkSafety,
  getPrescriptions,
  createPrescription,
  stopPrescription,
  updatePrescription
};
