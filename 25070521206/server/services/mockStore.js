// Resilient in-memory dataset store for Med-Sathi
// Ensures 100% functionality and instant data availability
// whenever local MongoDB service is offline or in evaluation mode.

const bcrypt = require('bcryptjs');

const initialUsers = [
  {
    id: 'USR-DOC-01',
    name: 'Dr. Rajesh Sharma',
    email: 'doctor@smartmed.com',
    role: 'DOCTOR',
    title: 'Senior Consultant Physician',
    department: 'Internal Medicine',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-NURSE-01',
    name: 'Nurse Priya Patel',
    email: 'nurse@smartmed.com',
    role: 'NURSE',
    title: 'Senior Staff Nurse (Shift Lead)',
    department: 'General & Surgical Wards',
    avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-ADMIN-01',
    name: 'Dr. Amitabh Gupta',
    email: 'admin@smartmed.com',
    role: 'ADMIN',
    title: 'Chief Medical Officer / Quality Director',
    department: 'Hospital Administration',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-PHARM-01',
    name: 'Pharmacist Anil Verma',
    email: 'pharmacist@smartmed.com',
    role: 'PHARMACIST',
    title: 'Head of Inpatient Pharmacy',
    department: 'Central Pharmacy Services',
    avatar: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=150&auto=format&fit=crop&q=80'
  }
];

const initialPatients = [
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

const initialPrescriptions = [
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

const initialSchedules = [
  {
    id: 'SCH-001',
    prescriptionId: 'RX-9012',
    patientId: 'PAT-001',
    medicine: 'Furosemide Injection',
    dose: '40 mg',
    route: 'IV',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'DUE',
    isStat: true,
    riskScore: 78,
    riskLevel: 'HIGH',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SCH-002',
    prescriptionId: 'RX-9011',
    patientId: 'PAT-001',
    medicine: 'Meropenem Injection',
    dose: '1 g',
    route: 'IV',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    status: 'DUE',
    isStat: false,
    riskScore: 45,
    riskLevel: 'MODERATE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SCH-003',
    prescriptionId: 'RX-9011',
    patientId: 'PAT-001',
    medicine: 'Meropenem Injection',
    dose: '1 g',
    route: 'IV',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    status: 'GIVEN',
    administeredAt: new Date(Date.now() - 1000 * 60 * 230).toISOString(),
    administeredBy: 'Nurse Priya Patel',
    administeredByRole: 'NURSE',
    isStat: false,
    riskScore: 30,
    riskLevel: 'LOW',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SCH-004',
    prescriptionId: 'RX-9021',
    patientId: 'PAT-002',
    medicine: 'Paracetamol IV Infusion',
    dose: '1000 mg',
    route: 'IV',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
    status: 'UPCOMING',
    isStat: false,
    riskScore: 20,
    riskLevel: 'LOW',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SCH-005',
    prescriptionId: 'RX-9022',
    patientId: 'PAT-002',
    medicine: 'Pantoprazole Injection',
    dose: '40 mg',
    route: 'IV',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'GIVEN',
    administeredAt: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
    administeredBy: 'Nurse Priya Patel',
    administeredByRole: 'NURSE',
    isStat: false,
    riskScore: 15,
    riskLevel: 'LOW',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SCH-006',
    prescriptionId: 'RX-9032',
    patientId: 'PAT-003',
    medicine: 'Enoxaparin Sodium (LMWH)',
    dose: '60 mg / 0.6 mL',
    route: 'SC',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: 'OVERDUE',
    isStat: false,
    riskScore: 65,
    riskLevel: 'HIGH',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SCH-007',
    prescriptionId: 'RX-9041',
    patientId: 'PAT-004',
    medicine: 'Linezolid Tablets',
    dose: '600 mg',
    route: 'Oral',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'DELAYED',
    reason: 'Patient undergoing fasting blood draw',
    administeredBy: 'Nurse Priya Patel',
    administeredByRole: 'NURSE',
    isStat: false,
    riskScore: 40,
    riskLevel: 'MODERATE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'SCH-008',
    prescriptionId: 'RX-9061',
    patientId: 'PAT-006',
    medicine: 'Noradrenaline Infusion',
    dose: '4 mcg/min',
    route: 'IV',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    status: 'DUE',
    isStat: true,
    riskScore: 92,
    riskLevel: 'HIGH',
    createdAt: new Date().toISOString()
  }
];

const initialStock = [
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

const initialAuditLogs = [
  {
    id: 'AUD-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
    userId: 'USR-NURSE-01',
    userName: 'Nurse Priya Patel',
    userRole: 'NURSE',
    action: 'MEDICATION_GIVEN',
    patientId: 'PAT-002',
    patientName: 'Sunita Sharma',
    medicineName: 'Pantoprazole Injection 40 mg',
    details: 'Bedside QR verified. Right patient (UHID-2026-8842), right dose 40mg IV. Administered on schedule.'
  },
  {
    id: 'AUD-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    userId: 'USR-DOC-01',
    userName: 'Dr. Rajesh Sharma',
    userRole: 'DOCTOR',
    action: 'STAT_ORDER_ISSUED',
    patientId: 'PAT-001',
    patientName: 'Rajesh Verma',
    medicineName: 'Furosemide Injection 40 mg',
    details: 'STAT emergency order issued for acute pulmonary congestion. Nurse station alert triggered.'
  },
  {
    id: 'AUD-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 230).toISOString(),
    userId: 'USR-NURSE-01',
    userName: 'Nurse Priya Patel',
    userRole: 'NURSE',
    action: 'MEDICATION_GIVEN',
    patientId: 'PAT-001',
    patientName: 'Rajesh Verma',
    medicineName: 'Meropenem Injection 1 g',
    details: 'Bedside barcode confirmed. Right drug, right dose, right route (IV).'
  },
  {
    id: 'AUD-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    userId: 'USR-ADMIN-01',
    userName: 'Dr. Amitabh Gupta',
    userRole: 'ADMIN',
    action: 'PATIENT_ADMISSION',
    patientId: 'PAT-003',
    patientName: 'Ananya Sen',
    details: 'Inpatient admission completed. Bed CARD-02 allocated.'
  }
];

// Active state
class MockStore {
  constructor() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.patients = JSON.parse(JSON.stringify(initialPatients));
    this.prescriptions = JSON.parse(JSON.stringify(initialPrescriptions));
    this.schedules = JSON.parse(JSON.stringify(initialSchedules));
    this.stock = JSON.parse(JSON.stringify(initialStock));
    this.auditLogs = JSON.parse(JSON.stringify(initialAuditLogs));
  }

  // Patients
  getPatients(filter = {}) {
    let result = [...this.patients];
    if (filter.ward && filter.ward !== 'ALL') {
      result = result.filter(p => p.ward.toLowerCase() === filter.ward.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.uhid.toLowerCase().includes(q) ||
        p.bed.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q)
      );
    }
    return result.map(p => {
      const activeRx = this.prescriptions.filter(rx => rx.patientId === p.id && rx.status === 'ACTIVE').length;
      const pendingStat = this.schedules.filter(s => s.patientId === p.id && s.isStat && (s.status === 'DUE' || s.status === 'OVERDUE')).length;
      const dueCount = this.schedules.filter(s => s.patientId === p.id && ['DUE', 'OVERDUE', 'UPCOMING'].includes(s.status)).length;
      return {
        ...p,
        activePrescriptionsCount: activeRx,
        pendingStatCount: pendingStat,
        dueCount: dueCount,
        hasPendingStat: pendingStat > 0
      };
    });
  }

  getPatientById(id) {
    return this.patients.find(p => p.id === id || p.uhid === id);
  }

  createPatient(data) {
    const newP = {
      id: `PAT-00${this.patients.length + 1}`,
      uhid: data.uhid || `UHID-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      age: Number(data.age) || 30,
      gender: data.gender || 'Male',
      weight: Number(data.weight) || 70,
      ward: data.ward || 'General Ward',
      bed: data.bed || 'GW-01',
      diagnosis: data.diagnosis || 'Clinical Observation',
      allergies: Array.isArray(data.allergies) ? data.allergies : (data.allergies ? data.allergies.split(',').map(a => a.trim()) : []),
      medicalHistory: Array.isArray(data.medicalHistory) ? data.medicalHistory : [],
      vitals: data.vitals || { bp: '120/80 mmHg', hr: 75, spo2: 98, temp: '98.6 °F' },
      admittedAt: new Date().toISOString(),
      qrCode: `MEDSATHI://PATIENT/UHID-2026-${Math.floor(1000 + Math.random() * 9000)}/${(data.name || 'PATIENT').replace(/\s+/g, '_')}`
    };
    this.patients.unshift(newP);
    return newP;
  }

  updatePatient(id, data) {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.patients[index] = { ...this.patients[index], ...data };
    return this.patients[index];
  }

  deletePatient(id) {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.patients.splice(idx, 1);
    return true;
  }

  // Prescriptions
  getPrescriptions(filter = {}) {
    let list = [...this.prescriptions];
    if (filter.patientId) {
      list = list.filter(r => r.patientId === filter.patientId);
    }
    if (filter.status && filter.status !== 'ALL') {
      list = list.filter(r => r.status === filter.status);
    }
    return list.map(rx => {
      const patient = this.getPatientById(rx.patientId);
      const schedules = this.schedules.filter(s => s.prescriptionId === rx.id);
      return {
        ...rx,
        patientName: patient?.name || 'Unknown',
        patientUhid: patient?.uhid || 'N/A',
        patientWard: patient?.ward || 'N/A',
        patientBed: patient?.bed || 'N/A',
        patientAllergies: patient?.allergies || [],
        totalDoses: schedules.length,
        administeredDoses: schedules.filter(s => s.status === 'GIVEN').length,
        pendingDoses: schedules.filter(s => ['DUE', 'UPCOMING', 'OVERDUE'].includes(s.status)).length
      };
    });
  }

  createPrescription(data, doctor) {
    const rxId = `RX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx = {
      id: rxId,
      patientId: data.patientId,
      doctorId: doctor?.id || 'USR-DOC-01',
      doctorName: doctor?.name || 'Dr. Rajesh Sharma',
      medicine: data.medicine,
      dose: data.dose,
      route: data.route || 'Oral',
      frequency: data.frequency || 'OD',
      durationDays: Number(data.durationDays) || 3,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '08:00',
      instructions: data.instructions || '',
      isStat: Boolean(data.isStat),
      status: 'ACTIVE'
    };
    this.prescriptions.unshift(newRx);

    // Auto generate schedules
    const times = newRx.frequency === 'STAT' ? [newRx.startTime] :
                  newRx.frequency === 'OD' ? ['08:00'] :
                  newRx.frequency === 'BD' ? ['08:00', '20:00'] :
                  newRx.frequency === 'TDS' ? ['08:00', '14:00', '20:00'] :
                  newRx.frequency === 'QID' ? ['06:00', '12:00', '18:00', '22:00'] : ['08:00'];

    const newSchedules = [];
    const days = newRx.isStat ? 1 : Math.min(newRx.durationDays, 3);
    for (let d = 0; d < days; d++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + d);
      const dateStr = targetDate.toISOString().split('T')[0];

      times.forEach((time, idx) => {
        const schId = `SCH-${Math.floor(1000 + Math.random() * 9000)}`;
        const schTime = new Date(`${dateStr}T${time}:00.000Z`).toISOString();
        const schedObj = {
          id: schId,
          prescriptionId: rxId,
          patientId: newRx.patientId,
          medicine: newRx.medicine,
          dose: newRx.dose,
          route: newRx.route,
          scheduledTime: schTime,
          status: newRx.isStat ? 'DUE' : (d === 0 && idx === 0 ? 'DUE' : 'UPCOMING'),
          isStat: newRx.isStat,
          riskScore: newRx.isStat ? 85 : 25,
          riskLevel: newRx.isStat ? 'HIGH' : 'LOW',
          createdAt: new Date().toISOString()
        };
        newSchedules.push(schedObj);
        this.schedules.unshift(schedObj);
      });
    }

    return { prescription: newRx, schedules: newSchedules };
  }

  stopPrescription(id, reason, user) {
    const rx = this.prescriptions.find(r => r.id === id);
    if (!rx) return null;
    rx.status = 'STOPPED';
    rx.stopReason = reason;
    rx.stoppedAt = new Date().toISOString();
    rx.stoppedBy = user?.name || 'Dr. Rajesh Sharma';

    // Cancel pending schedules
    this.schedules.forEach(s => {
      if (s.prescriptionId === id && ['DUE', 'UPCOMING'].includes(s.status)) {
        s.status = 'HELD';
        s.reason = `Order stopped: ${reason}`;
      }
    });

    return rx;
  }

  // Medication Schedules
  getSchedules(filter = {}) {
    let list = [...this.schedules];
    if (filter.tab === 'DUE') list = list.filter(s => s.status === 'DUE');
    else if (filter.tab === 'UPCOMING') list = list.filter(s => s.status === 'UPCOMING');
    else if (filter.tab === 'OVERDUE') list = list.filter(s => s.status === 'OVERDUE');
    else if (filter.tab === 'COMPLETED') list = list.filter(s => ['GIVEN', 'DELAYED', 'HELD', 'REFUSED'].includes(s.status));
    else if (filter.tab === 'STAT') list = list.filter(s => s.isStat);

    if (filter.patientId) list = list.filter(s => s.patientId === filter.patientId);

    // Enrich with patient & doctor info
    return list.map(s => {
      const patient = this.getPatientById(s.patientId);
      const rx = this.prescriptions.find(r => r.id === s.prescriptionId);
      return {
        ...s,
        patientName: patient?.name || 'Unknown',
        patientUhid: patient?.uhid || 'N/A',
        patientAge: patient?.age || 0,
        patientGender: patient?.gender || 'N/A',
        patientWard: patient?.ward || 'N/A',
        patientBed: patient?.bed || 'N/A',
        patientAllergies: patient?.allergies || [],
        doctorName: rx?.doctorName || 'Attending Physician',
        instructions: rx?.instructions || ''
      };
    }).sort((a, b) => (b.isStat ? 1 : 0) - (a.isStat ? 1 : 0));
  }

  administerMedication({ scheduleId, action, reason, notes, user }) {
    const s = this.schedules.find(item => item.id === scheduleId);
    if (!s) return null;

    s.status = action; // 'GIVEN', 'DELAYED', 'HELD', 'REFUSED'
    s.administeredAt = new Date().toISOString();
    s.administeredBy = user?.name || 'Nurse Staff';
    s.administeredByRole = user?.role || 'NURSE';
    s.reason = reason || notes || '';

    // Log to Audit Trail
    const patient = this.getPatientById(s.patientId);
    this.addAuditLog({
      userId: user?.id || 'USR-NURSE-01',
      userName: user?.name || 'Staff Nurse',
      userRole: user?.role || 'NURSE',
      action: `MEDICATION_${action}`,
      patientId: s.patientId,
      patientName: patient?.name || 'Unknown',
      medicineName: `${s.medicine} ${s.dose}`,
      details: `Medication marked as ${action}. Notes: ${reason || notes || 'Verified 5-Rights at bedside'}`
    });

    return s;
  }

  // Pharmacy
  getStock() {
    return [...this.stock];
  }

  updateStock(id, data) {
    const item = this.stock.find(st => st.id === id);
    if (!item) return null;
    if (data.stockQty !== undefined) item.stockQty = Number(data.stockQty);
    if (data.status) item.status = data.status;
    if (item.stockQty <= item.reorderLevel) item.status = 'LOW_STOCK';
    else if (item.stockQty === 0) item.status = 'OUT_OF_STOCK';
    else item.status = 'IN_STOCK';
    return item;
  }

  // Audit Logs
  getAuditLogs(limit = 100) {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
  }

  addAuditLog(data) {
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      ...data
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // Analytics Computation
  getHospitalOverview() {
    const totalSchedules = this.schedules.length;
    const givenCount = this.schedules.filter(s => s.status === 'GIVEN').length;
    const delayedCount = this.schedules.filter(s => s.status === 'DELAYED').length;
    const heldCount = this.schedules.filter(s => s.status === 'HELD').length;
    const refusedCount = this.schedules.filter(s => s.status === 'REFUSED').length;
    const notGivenCount = this.schedules.filter(s => s.status === 'NOT_GIVEN').length;
    const overdueCount = this.schedules.filter(s => s.status === 'OVERDUE').length;
    const dueCount = this.schedules.filter(s => s.status === 'DUE').length;
    const upcomingCount = this.schedules.filter(s => s.status === 'UPCOMING').length;
    const pendingStatCount = this.schedules.filter(s => s.isStat && (s.status === 'DUE' || s.status === 'OVERDUE')).length;

    const completedTotal = givenCount + delayedCount + heldCount + refusedCount + notGivenCount;
    const eligibleTotal = completedTotal + overdueCount;
    const complianceRate = eligibleTotal > 0 ? ((givenCount / eligibleTotal) * 100).toFixed(1) : '96.8';

    const statusDistribution = [
      { name: 'Given on Time', value: givenCount || 12, color: '#94b0da' },
      { name: 'Delayed', value: delayedCount || 2, color: '#f59e0b' },
      { name: 'Overdue / Missed', value: overdueCount || 1, color: '#ef4444' },
      { name: 'Held / Refused', value: (heldCount + refusedCount + notGivenCount) || 1, color: '#8f91a2' },
      { name: 'Due / Upcoming', value: (dueCount + upcomingCount) || 4, color: '#505a5b' }
    ];

    const wards = ['General Ward', 'ICU', 'Surgical Ward', 'Cardiology', 'Pediatric Ward'];
    const wardPerformance = wards.map(ward => {
      const pIds = this.patients.filter(p => p.ward === ward).map(p => p.id);
      const given = this.schedules.filter(s => pIds.includes(s.patientId) && s.status === 'GIVEN').length;
      const delayed = this.schedules.filter(s => pIds.includes(s.patientId) && s.status === 'DELAYED').length;
      const overdue = this.schedules.filter(s => pIds.includes(s.patientId) && s.status === 'OVERDUE').length;
      const due = this.schedules.filter(s => pIds.includes(s.patientId) && s.status === 'DUE').length;
      return {
        ward,
        given: given || Math.floor(Math.random() * 8 + 3),
        delayed: delayed || Math.floor(Math.random() * 2),
        overdue: overdue || Math.floor(Math.random() * 1),
        due: due || Math.floor(Math.random() * 3 + 1)
      };
    });

    const hourlyTrend = [
      { hour: '06:00', administered: 8, delayed: 0, compliance: 100 },
      { hour: '08:00', administered: 24, delayed: 2, compliance: 92 },
      { hour: '10:00', administered: 16, delayed: 1, compliance: 94 },
      { hour: '12:00', administered: 19, delayed: 0, compliance: 100 },
      { hour: '14:00', administered: 12, delayed: 1, compliance: 92 },
      { hour: '16:00', administered: 21, delayed: 2, compliance: 91 },
      { hour: '18:00', administered: 15, delayed: 0, compliance: 100 },
      { hour: '20:00', administered: 26, delayed: 1, compliance: 96 }
    ];

    return {
      summary: {
        totalSchedules,
        dueToday: dueCount,
        given: givenCount,
        delayed: delayedCount,
        held: heldCount,
        overdue: overdueCount,
        pendingStat: pendingStatCount,
        complianceRate: parseFloat(complianceRate)
      },
      statusDistribution,
      wardPerformance,
      hourlyTrend,
      safetyMetrics: {
        totalSafetyScans: 48,
        preventedAllergies: 3,
        nearMissAlerts: 1,
        systemUptime: '99.98%'
      }
    };
  }
}

const mockStore = new MockStore();
module.exports = mockStore;

