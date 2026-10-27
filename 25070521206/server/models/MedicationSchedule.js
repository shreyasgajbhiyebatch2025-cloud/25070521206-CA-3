const mongoose = require('mongoose');

const medicationScheduleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    prescriptionId: {
      type: String,
      required: [true, 'Prescription ID is required'],
      index: true,
    },
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      index: true,
    },
    medicine: {
      type: String,
      required: true,
    },
    dose: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
      default: 'Oral',
    },
    scheduledTime: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['DUE', 'UPCOMING', 'OVERDUE', 'GIVEN', 'DELAYED', 'HELD', 'REFUSED', 'NOT_GIVEN'],
      default: 'DUE',
      index: true,
    },
    administeredAt: {
      type: String,
      default: null,
    },
    administeredBy: {
      type: String,
      default: null,
    },
    administeredByRole: {
      type: String,
      default: null,
    },
    reason: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    isStat: {
      type: Boolean,
      default: false,
      index: true,
    },
    riskScore: {
      type: Number,
      default: 15,
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH'],
      default: 'LOW',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicationSchedule', medicationScheduleSchema);

