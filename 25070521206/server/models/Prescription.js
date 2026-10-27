const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      index: true,
    },
    doctorId: {
      type: String,
      required: [true, 'Doctor ID is required'],
    },
    doctorName: {
      type: String,
      required: [true, 'Doctor Name is required'],
    },
    medicine: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    dose: {
      type: String,
      required: [true, 'Dose is required'],
      trim: true,
    },
    route: {
      type: String,
      required: [true, 'Route is required'],
      default: 'Oral',
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      default: 'TDS',
    },
    durationDays: {
      type: Number,
      required: true,
      default: 5,
    },
    startDate: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split('T')[0],
    },
    startTime: {
      type: String,
      default: '08:00',
    },
    instructions: {
      type: String,
      default: '',
    },
    isStat: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'MODIFIED', 'STOPPED'],
      default: 'ACTIVE',
      index: true,
    },
    stoppedReason: {
      type: String,
      default: null,
    },
    stoppedBy: {
      type: String,
      default: null,
    },
    stoppedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);

