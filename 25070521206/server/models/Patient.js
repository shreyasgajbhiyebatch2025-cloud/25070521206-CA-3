const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    uhid: {
      type: String,
      required: [true, 'UHID is required'],
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Patient age is required'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight in kg is required'],
    },
    ward: {
      type: String,
      required: [true, 'Ward is required'],
      enum: ['General Ward', 'ICU', 'Surgical Ward', 'Pediatric Ward', 'Cardiology', 'Emergency'],
      default: 'General Ward',
      index: true,
    },
    bed: {
      type: String,
      required: [true, 'Bed number is required'],
      trim: true,
    },
    diagnosis: {
      type: String,
      required: [true, 'Clinical diagnosis is required'],
    },
    allergies: {
      type: [String],
      default: [],
    },
    medicalHistory: {
      type: [String],
      default: [],
    },
    vitals: {
      bp: { type: String, default: '120/80 mmHg' },
      hr: { type: Number, default: 75 },
      spo2: { type: Number, default: 98 },
      temp: { type: String, default: '98.6 °F' },
    },
    admittedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    qrCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Patient', patientSchema);

