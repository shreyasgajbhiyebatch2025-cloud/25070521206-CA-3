require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Patient = require('./models/Patient');
const Prescription = require('./models/Prescription');
const MedicationSchedule = require('./models/MedicationSchedule');
const PharmacyStock = require('./models/PharmacyStock');
const AuditLog = require('./models/AuditLog');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    const conn = await connectDB();
    if (!conn) {
      console.warn('[Seed] No active database connection. Skipping seed.');
      return;
    }

    console.log('[Seed] Resetting collections...');
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Prescription.deleteMany({});
    await MedicationSchedule.deleteMany({});
    await PharmacyStock.deleteMany({});
    await AuditLog.deleteMany({});

    // 1. Seed Users (with hashed passwords)
    console.log('[Seed] Seeding Clinical Users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        id: 'USR-DOC-01',
        name: 'Dr. Rajesh Sharma',
        email: 'doctor@smartmed.com',
        password: hashedPassword,
        role: 'DOCTOR',
        title: 'Senior Consultant Physician',
        department: 'Internal Medicine',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'USR-NURSE-01',
        name: 'Nurse Priya Patel',
        email: 'nurse@smartmed.com',
        password: hashedPassword,
        role: 'NURSE',
        title: 'Senior Staff Nurse (Shift Lead)',
        department: 'General & Surgical Wards',
        avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'USR-ADMIN-01',
        name: 'Dr. Amitabh Gupta',
        email: 'admin@smartmed.com',
        password: hashedPassword,
        role: 'ADMIN',
        title: 'Chief Medical Officer / Quality Director',
        department: 'Hospital Administration',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'USR-PHARM-01',
        name: 'Pharmacist Anil Verma',
        email: 'pharmacist@smartmed.com',
        password: hashedPassword,
        role: 'PHARMACIST',
        title: 'Head of Inpatient Pharmacy',
        department: 'Central Pharmacy Services',
        avatar: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=150&auto=format&fit=crop&q=80'
      }
    ];

    // Use insertMany with pre-hashed passwords directly to bypass double-hash
    await User.collection.insertMany(users);

    // 2. Seed Patients
    console.log('[Seed] Seeding Inpatients...');
    const patients = [
      {
        id: 'PAT-001',
        uhid: 'UHID-2026-9021',
        name: 'Rajesh Verma',
        age: 58,
        gender: 'Male',
        weight: 74,
        ward: 'ICU',
        bed: 'ICU-03',
        diagnosis: 'Acute Respiratory Distress Syndrome (ARDS) & Sepsis',
        allergies: ['Penicillin', 'Sulfa'],
        medicalHistory: ['Type 2 Diabetes Mellitus', 'Hypertension (10 yrs)'],
        vitals: { bp: '138/86 mmHg', hr: 98, spo2: 94, temp: '100.8 °F' },
        admittedAt: '2026-10-24T06:30:00.000Z',
        qrCode: 'MEDSATHI://PATIENT/UHID-2026-9021/Rajesh_Verma'
      },
      {
        id: 'PAT-002',
        uhid: 'UHID-2026-8842',
        name: 'Sunita Sharma',
        age: 46,
        gender: 'Female',
        weight: 62,
        ward: 'Surgical Ward',
        bed: 'SW-07',
        diagnosis: 'Post-Op Laparoscopic Cholecystectomy (Day 2)',
        allergies: ['NSAID', 'Ibuprofen'],
        medicalHistory: ['Asthma (Mild persistent)'],
        vitals: { bp: '118/76 mmHg', hr: 78, spo2: 99, temp: '98.6 °F' },
        admittedAt: '2026-10-25T11:15:00.000Z',
        qrCode: 'MEDSATHI://PATIENT/UHID-2026-8842/Sunita_Sharma'
      },
      {
        id: 'PAT-003',
        uhid: 'UHID-2026-7731',
        name: 'Ananya Sen',
        age: 63,
        gender: 'Female',
        weight: 68,
        ward: 'Cardiology',
        bed: 'CARD-02',
        diagnosis: 'Acute NSTEMI with Congestive Cardiac Failure',
        allergies: [],
        medicalHistory: ['Dyslipidemia', 'Prior PTCA Stent (2021)'],
        vitals: { bp: '142/92 mmHg', hr: 84, spo2: 96, temp: '98.4 °F' },
        admittedAt: '2026-10-25T14:40:00.000Z',
        qrCode: 'MEDSATHI://PATIENT/UHID-2026-7731/Ananya_Sen'
      },
      {
        id: 'PAT-004',
        uhid: 'UHID-2026-6644',
        name: 'Vikram Malhotra',
        age: 51,
        gender: 'Male',
        weight: 82,
        ward: 'General Ward',
        bed: 'GW-12',
        diagnosis: 'Lower Limb Cellulitis with Uncontrolled Glycemia',
        allergies: ['Cephalosporin'],
        medicalHistory: ['Diabetic Neuropathy'],
        vitals: { bp: '126/82 mmHg', hr: 82, spo2: 98, temp: '99.2 °F' },
        admittedAt: '2026-10-26T08:00:00.000Z',
        qrCode: 'MEDSATHI://PATIENT/UHID-2026-6644/Vikram_Malhotra'
      },
      {
        id: 'PAT-005',
        uhid: 'UHID-2026-5520',
        name: 'Aarav Joshi',
        age: 8,
        gender: 'Male',
        weight: 26,
        ward: 'Pediatric Ward',
        bed: 'PED-05',
        diagnosis: 'Community-Acquired Lobar Pneumonia',
        allergies: [],
        medicalHistory: ['No known chronic illnesses'],
        vitals: { bp: '100/65 mmHg', hr: 104, spo2: 97, temp: '101.2 °F' },
        admittedAt: '2026-10-26T16:20:00.000Z',
        qrCode: 'MEDSATHI://PATIENT/UHID-2026-5520/Aarav_Joshi'
      },
      {
        id: 'PAT-006',
        uhid: 'UHID-2026-4419',
        name: 'Meera Patel',
        age: 72,
        gender: 'Female',
        weight: 54,
        ward: 'ICU',
        bed: 'ICU-01',
        diagnosis: 'Septic Shock secondary to Urosepsis & AKI',
        allergies: ['Morphine'],
        medicalHistory: ['CKD Stage 3', 'Chronic Atrial Fibrillation'],
        vitals: { bp: '92/58 mmHg', hr: 110, spo2: 93, temp: '101.9 °F' },
        admittedAt: '2026-10-24T02:10:00.000Z',
        qrCode: 'MEDSATHI://PATIENT/UHID-2026-4419/Meera_Patel'
      }
    ];

    await Patient.insertMany(patients);

    // 3. Seed Prescriptions
    console.log('[Seed] Seeding Prescriptions...');
    const prescriptions = [
      {
        id: 'RX-9011',
        patientId: 'PAT-001',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Meropenem Injection',
        dose: '1 g',
        route: 'IV',
        frequency: 'TDS',
        durationDays: 7,
        startDate: '2026-10-24',
        startTime: '08:00',
        instructions: 'Slow IV infusion over 30 mins. Monitor renal profile.',
        isStat: false,
        status: 'ACTIVE'
      },
      {
        id: 'RX-9012',
        patientId: 'PAT-001',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Furosemide Injection',
        dose: '40 mg',
        route: 'IV',
        frequency: 'STAT',
        durationDays: 1,
        startDate: '2026-10-27',
        startTime: '08:00',
        instructions: 'STAT urgent dose for pulmonary congestion.',
        isStat: true,
        status: 'ACTIVE'
      },
      {
        id: 'RX-9021',
        patientId: 'PAT-002',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Paracetamol IV Infusion',
        dose: '1000 mg',
        route: 'IV',
        frequency: 'Q6H',
        durationDays: 3,
        startDate: '2026-10-25',
        startTime: '06:00',
        instructions: 'Infuse over 15 minutes for post-op analgesia.',
        isStat: false,
        status: 'ACTIVE'
      },
      {
        id: 'RX-9022',
        patientId: 'PAT-002',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Pantoprazole Injection',
        dose: '40 mg',
        route: 'IV',
        frequency: 'OD',
        durationDays: 5,
        startDate: '2026-10-25',
        startTime: '08:00',
        instructions: 'Pre-meal morning dose.',
        isStat: false,
        status: 'ACTIVE'
      },
      {
        id: 'RX-9031',
        patientId: 'PAT-003',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Atorvastatin Tablets',
        dose: '40 mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 30,
        startDate: '2026-10-25',
        startTime: '20:00',
        instructions: 'Take at night after food.',
        isStat: false,
        status: 'ACTIVE'
      },
      {
        id: 'RX-9032',
        patientId: 'PAT-003',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Enoxaparin Sodium (LMWH)',
        dose: '60 mg / 0.6 mL',
        route: 'SC',
        frequency: 'BD',
        durationDays: 5,
        startDate: '2026-10-25',
        startTime: '08:00',
        instructions: 'Subcutaneous injection into anterior abdominal wall.',
        isStat: false,
        status: 'ACTIVE'
      },
      {
        id: 'RX-9041',
        patientId: 'PAT-004',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Linezolid Tablets',
        dose: '600 mg',
        route: 'Oral',
        frequency: 'BD',
        durationDays: 10,
        startDate: '2026-10-26',
        startTime: '08:00',
        instructions: 'Take with full glass of water. Monitor CBC weekly.',
        isStat: false,
        status: 'ACTIVE'
      },
      {
        id: 'RX-9061',
        patientId: 'PAT-006',
        doctorId: 'USR-DOC-01',
        doctorName: 'Dr. Rajesh Sharma',
        medicine: 'Noradrenaline Infusion',
        dose: '4 mcg/min',
        route: 'IV',
        frequency: 'STAT',
        durationDays: 1,
        startDate: '2026-10-27',
        startTime: '09:00',
        instructions: 'Titrate via central line to maintain MAP >= 65 mmHg.',
        isStat: true,
        status: 'ACTIVE'
      }
    ];

    await Prescription.insertMany(prescriptions);

    // 4. Seed Medication Schedules
    console.log('[Seed] Seeding Medication Schedules...');
    const schedules = [
      {
        id: 'SCH-001',
        prescriptionId: 'RX-9012',
        patientId: 'PAT-001',
        medicine: 'Furosemide Injection',
        dose: '40 mg',
        route: 'IV',
        scheduledTime: '2026-10-27T08:00:00.000Z',
        status: 'DUE',
        isStat: true,
        riskScore: 78,
        riskLevel: 'HIGH',
        createdAt: '2026-10-27T07:45:00.000Z'
      },
      {
        id: 'SCH-002',
        prescriptionId: 'RX-9011',
        patientId: 'PAT-001',
        medicine: 'Meropenem Injection',
        dose: '1 g',
        route: 'IV',
        scheduledTime: '2026-10-27T08:00:00.000Z',
        status: 'DUE',
        isStat: false,
        riskScore: 45,
        riskLevel: 'MODERATE',
        createdAt: '2026-10-24T08:00:00.000Z'
      },
      {
        id: 'SCH-003',
        prescriptionId: 'RX-9011',
        patientId: 'PAT-001',
        medicine: 'Meropenem Injection',
        dose: '1 g',
        route: 'IV',
        scheduledTime: '2026-10-26T16:00:00.000Z',
        status: 'GIVEN',
        administeredAt: '2026-10-26T16:08:00.000Z',
        administeredBy: 'Nurse Priya Patel',
        administeredByRole: 'NURSE',
        isStat: false,
        riskScore: 30,
        riskLevel: 'LOW',
        createdAt: '2026-10-24T08:00:00.000Z'
      },
      {
        id: 'SCH-004',
        prescriptionId: 'RX-9021',
        patientId: 'PAT-002',
        medicine: 'Paracetamol IV Infusion',
        dose: '1000 mg',
        route: 'IV',
        scheduledTime: '2026-10-27T12:00:00.000Z',
        status: 'UPCOMING',
        isStat: false,
        riskScore: 20,
        riskLevel: 'LOW',
        createdAt: '2026-10-25T06:00:00.000Z'
      },
      {
        id: 'SCH-005',
        prescriptionId: 'RX-9022',
        patientId: 'PAT-002',
        medicine: 'Pantoprazole Injection',
        dose: '40 mg',
        route: 'IV',
        scheduledTime: '2026-10-27T08:00:00.000Z',
        status: 'GIVEN',
        administeredAt: '2026-10-27T08:05:00.000Z',
        administeredBy: 'Nurse Priya Patel',
        administeredByRole: 'NURSE',
        isStat: false,
        riskScore: 15,
        riskLevel: 'LOW',
        createdAt: '2026-10-25T08:00:00.000Z'
      },
      {
        id: 'SCH-006',
        prescriptionId: 'RX-9032',
        patientId: 'PAT-003',
        medicine: 'Enoxaparin Sodium (LMWH)',
        dose: '60 mg / 0.6 mL',
        route: 'SC',
        scheduledTime: '2026-10-27T08:00:00.000Z',
        status: 'OVERDUE',
        isStat: false,
        riskScore: 65,
        riskLevel: 'HIGH',
        createdAt: '2026-10-25T08:00:00.000Z'
      },
      {
        id: 'SCH-007',
        prescriptionId: 'RX-9041',
        patientId: 'PAT-004',
        medicine: 'Linezolid Tablets',
        dose: '600 mg',
        route: 'Oral',
        scheduledTime: '2026-10-27T08:00:00.000Z',
        status: 'DELAYED',
        reason: 'Patient undergoing fasting blood draw',
        administeredBy: 'Nurse Priya Patel',
        administeredByRole: 'NURSE',
        isStat: false,
        riskScore: 40,
        riskLevel: 'MODERATE',
        createdAt: '2026-10-26T08:00:00.000Z'
      },
      {
        id: 'SCH-008',
        prescriptionId: 'RX-9061',
        patientId: 'PAT-006',
        medicine: 'Noradrenaline Infusion',
        dose: '4 mcg/min',
        route: 'IV',
        scheduledTime: '2026-10-27T09:00:00.000Z',
        status: 'DUE',
        isStat: true,
        riskScore: 92,
        riskLevel: 'HIGH',
        createdAt: '2026-10-27T08:50:00.000Z'
      }
    ];

    await MedicationSchedule.insertMany(schedules);

    // 5. Seed Pharmacy Inventory
    console.log('[Seed] Seeding Pharmacy Stock...');
    const stockItems = [
      { id: 'STK-001', medicine: 'Meropenem Injection 1g', category: 'Antibiotics', stockQty: 84, unit: 'Vials', reorderLevel: 25, location: 'Bay A-3', status: 'IN_STOCK' },
      { id: 'STK-002', medicine: 'Furosemide Injection 20mg/2mL', category: 'Emergency & Diuretics', stockQty: 110, unit: 'Ampoules', reorderLevel: 30, location: 'Bay E-1', status: 'IN_STOCK' },
      { id: 'STK-003', medicine: 'Paracetamol IV 100mL (1000mg)', category: 'Analgesics', stockQty: 14, unit: 'Infusion Bottles', reorderLevel: 20, location: 'Bay B-2', status: 'LOW_STOCK' },
      { id: 'STK-004', medicine: 'Pantoprazole Injection 40mg', category: 'Gastrointestinal', stockQty: 140, unit: 'Vials', reorderLevel: 30, location: 'Bay C-1', status: 'IN_STOCK' },
      { id: 'STK-005', medicine: 'Enoxaparin Sodium 60mg/0.6mL', category: 'Anticoagulants', stockQty: 42, unit: 'PFS Syringes', reorderLevel: 15, location: 'Refrigerator B', status: 'IN_STOCK' },
      { id: 'STK-006', medicine: 'Noradrenaline Injection 4mg/2mL', category: 'Critical Care Vasopressors', stockQty: 18, unit: 'Ampoules', reorderLevel: 20, location: 'Bay ICU-Emergency', status: 'LOW_STOCK' },
      { id: 'STK-007', medicine: 'Regular Insulin (Actrapid) 100 IU/mL', category: 'Endocrine & Diabetes', stockQty: 32, unit: 'Vials', reorderLevel: 12, location: 'Refrigerator A', status: 'IN_STOCK' },
      { id: 'STK-008', medicine: 'Linezolid Tablets 600mg', category: 'Antibiotics', stockQty: 6, unit: 'Tablets', reorderLevel: 15, location: 'Bay A-4', status: 'LOW_STOCK' },
      { id: 'STK-009', medicine: 'Amiodarone Injection 150mg/3mL', category: 'ACLS Emergency Resuscitation', stockQty: 28, unit: 'Ampoules', reorderLevel: 10, location: 'Crash Cart Bay', status: 'IN_STOCK' },
      { id: 'STK-010', medicine: 'Atropine Sulfate 0.6mg/mL', category: 'ACLS Emergency Resuscitation', stockQty: 45, unit: 'Ampoules', reorderLevel: 15, location: 'Crash Cart Bay', status: 'IN_STOCK' }
    ];

    await PharmacyStock.insertMany(stockItems);

    // 6. Seed Traceable Audit Logs
    console.log('[Seed] Seeding Audit Logs...');
    const auditLogs = [
      {
        id: 'AUD-001',
        timestamp: '2026-10-27T08:05:00.000Z',
        userId: 'USR-NURSE-01',
        userName: 'Nurse Priya Patel',
        userRole: 'NURSE',
        action: 'MEDICATION_GIVEN',
        patientId: 'PAT-002',
        patientName: 'Sunita Sharma',
        medicineName: 'Pantoprazole Injection 40 mg',
        details: 'Bedside QR verified. Verified right patient (UHID-2026-8842), right dose 40mg IV. Dose administered on schedule.'
      },
      {
        id: 'AUD-002',
        timestamp: '2026-10-27T07:45:00.000Z',
        userId: 'USR-DOC-01',
        userName: 'Dr. Rajesh Sharma',
        userRole: 'DOCTOR',
        action: 'STAT_ORDER_ISSUED',
        patientId: 'PAT-001',
        patientName: 'Rajesh Verma',
        medicineName: 'Furosemide Injection 40 mg',
        details: 'STAT emergency order issued for acute pulmonary congestion. Priority flag raised on nurse station.'
      },
      {
        id: 'AUD-003',
        timestamp: '2026-10-26T16:08:00.000Z',
        userId: 'USR-NURSE-01',
        userName: 'Nurse Priya Patel',
        userRole: 'NURSE',
        action: 'MEDICATION_GIVEN',
        patientId: 'PAT-001',
        patientName: 'Rajesh Verma',
        medicineName: 'Meropenem Injection 1 g',
        details: 'Medication recorded as GIVEN after wristband barcode verification.'
      },
      {
        id: 'AUD-004',
        timestamp: '2026-10-25T14:40:00.000Z',
        userId: 'USR-ADMIN-01',
        userName: 'Dr. Amitabh Gupta',
        userRole: 'ADMIN',
        action: 'PATIENT_ADMISSION',
        patientId: 'PAT-003',
        patientName: 'Ananya Sen',
        details: 'Inpatient admission completed. Assigned to Cardiology, Bed CARD-02.'
      }
    ];

    await AuditLog.insertMany(auditLogs);

    console.log('[Seed] Database successfully populated with realistic demo dataset!');
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
  }
};

// If run directly: `node seed.js`
if (require.main === module) {
  seedData().then(() => {
    console.log('[Seed] Script finished.');
    process.exit(0);
  });
}

module.exports = seedData;
