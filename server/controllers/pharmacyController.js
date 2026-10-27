const PharmacyStock = require('../models/PharmacyStock');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const MedicationSchedule = require('../models/MedicationSchedule');
const { isConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

// @desc    Get inventory stock items with reorder warnings
// @route   GET /api/pharmacy/inventory
// @access  Public / Private
const getInventory = async (req, res) => {
  try {
    if (isConnected()) {
      try {
        const stock = await PharmacyStock.find({}).sort({ category: 1, medicine: 1 });
        return res.json({ success: true, count: stock.length, data: stock });
      } catch (dbErr) {
        console.warn('[Pharmacy Controller] Mongoose getInventory fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const stock = mockStore.getStock();
    res.json({ success: true, count: stock.length, data: stock });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Active hospital medication requirements generated from active prescriptions
// @route   GET /api/pharmacy/orders
// @access  Public / Private
const getOrders = async (req, res) => {
  try {
    if (isConnected()) {
      try {
        const activePrescriptions = await Prescription.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });

        const orders = await Promise.all(
          activePrescriptions.map(async (rx) => {
            const patient = await Patient.findOne({ id: rx.patientId });
            const totalDoses = await MedicationSchedule.countDocuments({ prescriptionId: rx.id });
            const dispensedDoses = await MedicationSchedule.countDocuments({ prescriptionId: rx.id, status: 'GIVEN' });

            return {
              prescriptionId: rx.id,
              medicine: rx.medicine,
              dose: rx.dose,
              route: rx.route,
              frequency: rx.frequency,
              durationDays: rx.durationDays,
              doctorName: rx.doctorName,
              createdAt: rx.createdAt,
              patientId: patient ? patient.id : rx.patientId,
              patientName: patient ? patient.name : 'Unknown',
              ward: patient ? patient.ward : 'N/A',
              bed: patient ? patient.bed : 'N/A',
              totalDoses,
              dispensedDoses
            };
          })
        );

        return res.json({ success: true, count: orders.length, data: orders });
      } catch (dbErr) {
        console.warn('[Pharmacy Controller] Mongoose getOrders fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const activePrescriptions = mockStore.prescriptions.filter(rx => rx.status === 'ACTIVE');
    const orders = activePrescriptions.map(rx => {
      const patient = mockStore.getPatientById(rx.patientId);
      const totalDoses = mockStore.schedules.filter(s => s.prescriptionId === rx.id).length;
      const dispensedDoses = mockStore.schedules.filter(s => s.prescriptionId === rx.id && s.status === 'GIVEN').length;

      return {
        prescriptionId: rx.id,
        medicine: rx.medicine,
        dose: rx.dose,
        route: rx.route,
        frequency: rx.frequency,
        durationDays: rx.durationDays,
        doctorName: rx.doctorName,
        createdAt: rx.startDate,
        patientId: patient ? patient.id : rx.patientId,
        patientName: patient ? patient.name : 'Unknown',
        ward: patient ? patient.ward : 'N/A',
        bed: patient ? patient.bed : 'N/A',
        totalDoses,
        dispensedDoses
      };
    });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update stock quantity / restock
// @route   PUT /api/pharmacy/inventory/:id
// @access  Private (Pharmacist / Admin)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQty, location, reorderLevel } = req.body;

    if (isConnected()) {
      try {
        const item = await PharmacyStock.findOne({ $or: [{ id }, { medicine: id }] });
        if (item) {
          if (stockQty !== undefined) item.stockQty = Number(stockQty);
          if (location) item.location = location;
          if (reorderLevel !== undefined) item.reorderLevel = Number(reorderLevel);

          await item.save();
          return res.json({ success: true, message: 'Stock updated successfully', data: item });
        }
      } catch (dbErr) {
        console.warn('[Pharmacy Controller] Mongoose updateStock fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    const updated = mockStore.updateStock(id, { stockQty, location, reorderLevel });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Pharmacy stock item not found' });
    }

    res.json({ success: true, message: 'Stock updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getInventory,
  getOrders,
  updateStock
};
