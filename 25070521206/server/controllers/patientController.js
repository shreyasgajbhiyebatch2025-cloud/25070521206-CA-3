const crypto = require('node:crypto');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const MedicationSchedule = require('../models/MedicationSchedule');
const AuditLog = require('../models/AuditLog');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

// @desc    Get all patients with filters & enhanced metadata
// @route   GET /api/patients
// @access  Private / Public demo
const getPatients = async (req, res) => {
  try {
    const { ward, search } = req.query;

    if (isConnected()) {
      try {
        const filter = {};
        if (ward && ward !== 'ALL') {
          filter.ward = ward;
        }

        if (search) {
          const searchRegex = new RegExp(search, 'i');
          filter.$or = [
            { name: searchRegex },
            { uhid: searchRegex },
            { bed: searchRegex },
            { diagnosis: searchRegex },
            { id: searchRegex }
          ];
        }

        const patients = await Patient.find(filter).sort({ ward: 1, bed: 1 });

        const enhanced = await Promise.all(
          patients.map(async (p) => {
            const patientObj = p.toObject ? p.toObject() : p;

            const activePrescriptionsCount = await Prescription.countDocuments({
              patientId: p.id,
              status: 'ACTIVE'
            });

            const pendingStatCount = await MedicationSchedule.countDocuments({
              patientId: p.id,
              isStat: true,
              status: { $in: ['DUE', 'OVERDUE'] }
            });

            const dueCount = await MedicationSchedule.countDocuments({
              patientId: p.id,
              status: { $in: ['DUE', 'OVERDUE', 'UPCOMING'] }
            });

            return {
              ...patientObj,
              activePrescriptionsCount,
              hasPendingStat: pendingStatCount > 0,
              dueCount
            };
          })
        );

        return res.json({ success: true, count: enhanced.length, data: enhanced });
      } catch (dbErr) {
        console.warn('[Patients Controller] Mongoose query fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const patients = mockStore.getPatients({ ward, search });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single patient profile by ID or UHID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      try {
        const patient = await Patient.findOne({
          $or: [{ id }, { uhid: id.toUpperCase() }]
        });

        if (patient) {
          const prescriptions = await Prescription.find({ patientId: patient.id }).sort({ createdAt: -1 });
          const medicationTimeline = await MedicationSchedule.find({ patientId: patient.id }).sort({ scheduledTime: 1 });

          return res.json({
            success: true,
            data: {
              patient,
              prescriptions,
              medicationTimeline
            }
          });
        }
      } catch (dbErr) {
        console.warn('[Patients Controller] Mongoose find fallback:', dbErr.message);
      }
    }

    const patient = mockStore.getPatientById(id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const prescriptions = mockStore.getPrescriptions({ patientId: patient.id });
    const medicationTimeline = mockStore.getSchedules({ patientId: patient.id });

    res.json({
      success: true,
      data: {
        patient,
        prescriptions,
        medicationTimeline
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private (Doctor / Admin)
const createPatient = async (req, res) => {
  try {
    const { name, age, gender, weight, ward, bed, diagnosis, allergies, medicalHistory, vitals } = req.body;

    if (!name || !age || !gender || !weight || !ward || !bed || !diagnosis) {
      return res.status(400).json({ success: false, error: 'Please provide all required patient information.' });
    }

    const patientId = 'PAT-' + Math.floor(100 + Math.random() * 900);
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const uhid = `UHID-2026-${randNum}`;

    if (isConnected()) {
      try {
        const newPatient = await Patient.create({
          id: patientId,
          uhid,
          name,
          age: Number(age),
          gender,
          weight: Number(weight),
          ward,
          bed,
          diagnosis,
          allergies: Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(a => a.trim()) : []),
          medicalHistory: medicalHistory || [],
          vitals: vitals || { bp: '120/80 mmHg', hr: 74, spo2: 98, temp: '98.4 °F' },
          qrCode: `MEDSATHI://PATIENT/${uhid}/${name.replace(/\s+/g, '_')}`
        });

        await AuditLog.create({
          id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
          userId: req.user ? req.user.id : 'USR-DOC-01',
          userName: req.user ? req.user.name : 'Dr. Attending',
          userRole: req.user ? req.user.role : 'DOCTOR',
          action: 'PATIENT_ADMISSION',
          patientId: newPatient.id,
          patientName: newPatient.name,
          details: `Admitted new inpatient ${newPatient.name} to Ward: ${newPatient.ward}, Bed: ${newPatient.bed}.`
        });

        return res.status(201).json({
          success: true,
          data: newPatient,
          message: 'Patient registered and admitted successfully'
        });
      } catch (dbErr) {
        console.warn('[Patients Controller] Mongoose create fallback:', dbErr.message);
      }
    }

    const newPatient = mockStore.createPatient({
      name,
      age,
      gender,
      weight,
      ward,
      bed,
      diagnosis,
      allergies,
      medicalHistory,
      vitals
    });

    mockStore.addAuditLog({
      userId: req.user ? req.user.id : 'USR-DOC-01',
      userName: req.user ? req.user.name : 'Dr. Attending',
      userRole: req.user ? req.user.role : 'DOCTOR',
      action: 'PATIENT_ADMISSION',
      patientId: newPatient.id,
      patientName: newPatient.name,
      details: `Admitted new inpatient ${newPatient.name} to Ward: ${newPatient.ward}, Bed: ${newPatient.bed}.`
    });

    res.status(201).json({
      success: true,
      data: newPatient,
      message: 'Patient registered and admitted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update patient record
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isConnected()) {
      try {
        const patient = await Patient.findOneAndUpdate({ id }, updates, { new: true });
        if (patient) {
          return res.json({ success: true, data: patient, message: 'Patient details updated' });
        }
      } catch (dbErr) {
        console.warn('[Patients Controller] Mongoose update fallback:', dbErr.message);
      }
    }

    const patient = mockStore.updatePatient(id, updates);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true, data: patient, message: 'Patient details updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete / Discharge patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin only)
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      try {
        const patient = await Patient.findOneAndDelete({ id });
        if (patient) {
          await Prescription.deleteMany({ patientId: id });
          await MedicationSchedule.deleteMany({ patientId: id });
          return res.json({ success: true, message: 'Patient discharged and records closed' });
        }
      } catch (dbErr) {
        console.warn('[Patients Controller] Mongoose delete fallback:', dbErr.message);
      }
    }

    const deleted = mockStore.deletePatient(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true, message: 'Patient discharged and records closed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
