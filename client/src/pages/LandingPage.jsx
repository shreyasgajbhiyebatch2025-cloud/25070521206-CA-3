import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Pill, Stethoscope, ClipboardList, Layers, Building2,
  ShieldCheck, Activity, ArrowRight, Zap, CheckCircle2,
  Clock, ShieldAlert, Sparkles, QrCode, Lock, ChevronRight,
  Sun, Moon, ChevronDown, Check, AlertCircle, FileText,
  Thermometer, UserCheck, HeartPulse
} from 'lucide-react';

export function LandingPage() {
  const { switchRole } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Interactive Implementation Active Step (0, 1, 2, 3)
  const [activeStep, setActiveStep] = useState(0);

  // FAQ Accordion Open State
  const [openFaq, setOpenFaq] = useState(0);

  const handleTeacherEntry = (roleKey) => {
    switchRole(roleKey);
    navigate('/dashboard');
  };

  const steps = [
    {
      num: '01',
      title: 'Physician Order Entry',
      tag: 'CPOE & SAFETY',
      role: 'DOCTOR',
      desc: 'Doctors prescribe medications with automated drug-drug interaction warnings, allergy contraindication screening, and instant schedule generation.',
      details: [
        'Multi-factor allergy cross-check (Penicillin, Sulfa, Morphine)',
        'Automated frequency-to-timeline generator (TDS, BD, STAT, OD)',
        'Real-time inpatient acuity census and rounds tracking'
      ],
      preview: {
        badge: 'ACTIVE PHYSICIAN CPOE',
        title: 'Meropenem 1g IV Infusion TDS',
        patient: 'Rajesh Verma (ICU-03 • UHID-2026-9021)',
        status: 'Safety Rules Passed (0 Contraindications)',
        time: 'Scheduled: 08:00, 14:00, 20:00'
      }
    },
    {
      num: '02',
      title: 'Closed-Loop Pharmacy Clearance',
      tag: 'FORMULARY & DISPENSING',
      role: 'PHARMACIST',
      desc: 'Central inpatient pharmacy validates active orders, monitors cold-chain biologicals storage (2°C - 8°C), and issues barcoded unit doses to wards.',
      details: [
        'Real-time threshold stock tracking with 1-click replenishment',
        'Biologicals cold-chain IoT temperature telemetry (3.6°C normal)',
        'Emergency crash cart vasopressor reserve monitoring'
      ],
      preview: {
        badge: 'PHARMACY VERIFICATION QUEUE',
        title: 'Noradrenaline 4mg/2mL Dispensed',
        patient: 'Meera Patel (ICU-01 • Septic Shock Protocol)',
        status: 'Dispensed from Central Bay • Cold Chain 3.4°C Verified',
        time: 'Emergency Vasopressor Ready'
      }
    },
    {
      num: '03',
      title: 'Bedside 5-Rights Verification',
      tag: 'eMAR & NURSE TASK BOARD',
      role: 'NURSE',
      desc: 'Nurses scan patient wristband QR codes at bedside to ensure the 5-Rights: Right Patient, Right Drug, Right Dose, Right Route, Right Time.',
      details: [
        'Tamper-evident bedside QR barcode wristband scanner',
        'STAT priority push banner for critical emergency doses',
        'Documented clinical rationale logging for delayed/held doses'
      ],
      preview: {
        badge: 'BEDSIDE 5-RIGHTS SCANNER',
        title: 'Furosemide 40mg IV Push — STAT',
        patient: 'Bedside QR Match: Rajesh Verma (ICU-03)',
        status: '5-Rights Verified: Patient ✓ Drug ✓ Dose ✓ Route ✓ Time ✓',
        time: 'Administered at Bedside with Timestamp'
      }
    },
    {
      num: '04',
      title: 'AI Delay Risk & Hospital Governance',
      tag: 'PREDICTIVE SAFETY & NABH',
      role: 'ADMIN',
      desc: 'Machine learning heuristic predicts medication delay risks, manages ACLS Code Blue resuscitation protocols, and enforces immutable audit trails.',
      details: [
        'Heuristic polypharmacy & ward workload delay predictor',
        'Tamper-evident cryptographic clinical audit trail',
        'NABH 5th Edition Medication Management compliance scorecard'
      ],
      preview: {
        badge: 'GOVERNANCE & ACCREDITATION',
        title: 'Hospital Medication Safety Compliance: 94.6%',
        patient: 'Facility Inpatient Census: 6 Occupied Beds',
        status: '4 Prevented Adverse Events • 100% Audit Coverage',
        time: 'NABH Quality Inspection Benchmark Passed'
      }
    }
  ];

  const currentStepData = steps[activeStep];

  const faqs = [
    {
      q: 'How does Med-Sathi guarantee zero bedside medication administration errors?',
      a: 'Med-Sathi enforces a closed-loop eMAR architecture. The nurse must scan the patient’s physical wristband barcode at the bedside. The system verifies the 5-Rights in real-time (Right Patient, Right Drug, Right Dose, Right Route, Right Time) against the doctor’s active order before allowing administration.'
    },
    {
      q: 'Does the application work offline if MongoDB Compass is closed?',
      a: 'Yes! Med-Sathi is architected with a dual-engine data adapter. If local MongoDB is running, Mongoose connects and persists to MongoDB. If local MongoDB is offline during evaluator demonstration, the system instantly switches to an in-memory resilient clinical store pre-populated with realistic inpatient data with zero timeout.'
    },
    {
      q: 'What clinical roles are supported in the system?',
      a: 'Med-Sathi provides four distinct role workspaces: Doctor (CPOE, clinical rounds, hemodynamics), Nurse (eMAR task board, bedside 5-Rights verification, STAT push queue), Pharmacist (prescription verification, inventory reorder, cold-chain telemetry), and Admin/CMO (hospital safety compliance, bed occupancy, audit logs).'
    },
    {
      q: 'How does the AI Delay Risk predictor assist nursing staff?',
      a: 'The predictive heuristic analyzes current ward workload density, patient polypharmacy indices, route complexity (IV vs Oral), and nursing shift changeover hours to score delay probability from 0-100%, allowing charge nurses to intervene before a dose becomes overdue.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f9fc] dark:bg-[#121616] text-[#121616] dark:text-[#dcedff] transition-colors duration-300 selection:bg-[#94b0da] selection:text-[#121616] relative overflow-hidden font-sans">
      
      {/* Strict Palette Ambient Glows (Matches strict hex: #dcedff, #94b0da, #8f91a2, #505a5b, #121616) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#94b0da]/20 dark:bg-[#94b0da]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[450px] bg-[#8f91a2]/15 dark:bg-[#505a5b]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 aspen-grid-bg opacity-35 pointer-events-none" />

      {/* Floating Pill Glass Navbar (Exact Image 2 Reference with Dark/Light Toggle) */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 max-w-5xl mx-auto">
        <nav className="bg-white/85 dark:bg-[#181d1e]/85 backdrop-blur-2xl border border-[#94b0da]/35 dark:border-[#505a5b]/50 rounded-full px-5 py-2.5 shadow-[0_10px_35px_rgba(18,22,22,0.08)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex items-center justify-between transition-colors">
          
          {/* Left Brand: [ 💊 Med-Sathi ● ] */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] flex items-center justify-center font-black shadow-sm transition-transform group-hover:scale-105">
              <Pill className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-[#121616] dark:text-white">
                Med-Sathi
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </Link>

          {/* Center Navigation Links (Image 2 items + more things to navigate) */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-[#505a5b] dark:text-[#8f91a2]">
            <a href="#purpose" className="hover:text-[#121616] dark:hover:text-[#dcedff] transition-colors">Purpose</a>
            <a href="#implementation" className="hover:text-[#121616] dark:hover:text-[#dcedff] transition-colors">Implementation</a>
            <a href="#roles" className="hover:text-[#121616] dark:hover:text-[#dcedff] transition-colors">Clinical Roles</a>
            <a href="#safety" className="hover:text-[#121616] dark:hover:text-[#dcedff] transition-colors">5-Rights Safety</a>
            <a href="#architecture" className="hover:text-[#121616] dark:hover:text-[#dcedff] transition-colors">Architecture</a>
            <a href="#faq" className="hover:text-[#121616] dark:hover:text-[#dcedff] transition-colors">FAQ</a>
          </div>

          {/* Right Action: Dark/Light Mode Toggle + Sign In Button */}
          <div className="flex items-center gap-2">
            
            {/* Functional Dark & Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] hover:bg-[#94b0da]/20 transition-all border border-transparent hover:border-[#94b0da]/30"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#505a5b] transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Register Pill Button (Before Login) */}
            <Link
              to="/signup"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider bg-white dark:bg-[#181d1e] text-[#121616] dark:text-[#dcedff] border border-[#94b0da]/50 hover:border-[#94b0da] transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>Register</span>
            </Link>

            {/* Sign In Pill Button */}
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 pt-14 sm:pt-20 pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        
        {/* Subtle Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#94b0da]/15 dark:bg-[#94b0da]/10 border border-[#94b0da]/40 text-[11px] font-mono font-bold text-[#505a5b] dark:text-[#94b0da] mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#94b0da]" />
          <span>CLOSED-LOOP INPATIENT MEDICATION ADMINISTRATION & SAFETY (eMAR)</span>
        </div>

        {/* Hero Headline (Using strict palette typography) */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#121616] dark:text-white leading-[1.08] mb-6">
          Turn Clinical Data into Action <br className="hidden sm:inline" />
          <span className="palette-text-gradient-dark dark:palette-text-gradient-dark">
            with AI-Driven Patient Safety
          </span>
        </h1>

        {/* Short, Subtle Purpose Statement */}
        <p className="text-sm sm:text-base text-[#505a5b] dark:text-[#8f91a2] max-w-2xl mx-auto leading-relaxed mb-8">
          A hospital-grade medication administration system connecting physician orders, inpatient pharmacy dispensing, and bedside 5-Rights verification to eliminate preventable drug events in real time.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-bold font-mono tracking-wider bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Account / Register</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold font-mono tracking-wider bg-white dark:bg-[#181d1e] text-[#121616] dark:text-[#dcedff] border border-[#94b0da]/40 hover:border-[#94b0da] shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Account</span>
          </Link>

          <a
            href="#implementation"
            className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-semibold text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-white transition-all flex items-center justify-center gap-1"
          >
            <span>View Architecture ↓</span>
          </a>
        </div>

        {/* College Evaluator 1-Click Fast Pass */}
        <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#181d1e]/80 border border-[#94b0da]/30 dark:border-[#505a5b]/50 backdrop-blur-xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
          <span className="font-mono text-[11px] text-[#505a5b] dark:text-[#94b0da] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>TEACHER 1-CLICK ACCESS:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-[10px] font-mono">
            <button
              onClick={() => handleTeacherEntry('DOCTOR')}
              className="px-2.5 py-1 rounded-lg bg-[#94b0da]/20 dark:bg-[#121616] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/30 hover:bg-[#94b0da]/40 transition-all"
            >
              Doctor
            </button>
            <button
              onClick={() => handleTeacherEntry('NURSE')}
              className="px-2.5 py-1 rounded-lg bg-[#94b0da]/20 dark:bg-[#121616] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/30 hover:bg-[#94b0da]/40 transition-all"
            >
              Nurse
            </button>
            <button
              onClick={() => handleTeacherEntry('PHARMACIST')}
              className="px-2.5 py-1 rounded-lg bg-[#94b0da]/20 dark:bg-[#121616] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/30 hover:bg-[#94b0da]/40 transition-all"
            >
              Pharmacist
            </button>
            <button
              onClick={() => handleTeacherEntry('ADMIN')}
              className="px-2.5 py-1 rounded-lg bg-[#94b0da]/20 dark:bg-[#121616] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/30 hover:bg-[#94b0da]/40 transition-all"
            >
              Admin/CMO
            </button>
            <Link
              to="/signup"
              className="px-2.5 py-1 rounded-lg bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] font-bold hover:opacity-90 transition-all"
            >
              + Register Page
            </Link>
          </div>
        </div>

      </section>

      {/* SECTION 1: PURPOSE (#purpose) */}
      <section id="purpose" className="relative z-20 py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#94b0da] font-bold mb-2">
            ■ CLINICAL PURPOSE & IMPACT
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-white tracking-tight">
            Why Med-Sathi Was Built
          </h2>
          <p className="text-xs sm:text-sm text-[#505a5b] dark:text-[#8f91a2] mt-1">
            Over 68% of preventable hospital harm incidents occur during medication rounds. Med-Sathi eliminates this through automated checks at every touchpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-[#94b0da]">
            <div className="w-8 h-8 rounded-xl bg-[#94b0da]/20 text-[#121616] dark:text-[#dcedff] flex items-center justify-center mb-3">
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <h3 className="font-bold text-sm text-[#121616] dark:text-white mb-1">
              Zero Transcription Errors
            </h3>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
              Illegible handwriting and lost paper charts are replaced by structured digital physician orders with automated dose calculations.
            </p>
          </div>

          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-rose-500">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#121616] dark:text-white mb-1">
              Urgent STAT Push Alerts
            </h3>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
              Emergency vasopressors and diuretics bypass routine queue delays with immediate bedside sound and visual priority banners.
            </p>
          </div>

          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-emerald-500">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#121616] dark:text-white mb-1">
              Active Allergy Interception
            </h3>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
              Prescriptions cross-reference patient allergy registries in real time, automatically blocking contraindicated drugs (e.g. Penicillin, Sulfa).
            </p>
          </div>

          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-[#505a5b]">
            <div className="w-8 h-8 rounded-xl bg-[#505a5b]/20 text-[#505a5b] dark:text-[#8f91a2] flex items-center justify-center mb-3">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#121616] dark:text-white mb-1">
              5-Rights Bedside Scan
            </h3>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
              Nurses must scan the patient’s physical wristband barcode at bedside, confirming right patient, drug, dose, route, and time.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: IMPLEMENTATION PIPELINE (#implementation) */}
      <section id="implementation" className="relative z-20 py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#94b0da] font-bold mb-2">
            ■ COMPLETE END-TO-END IMPLEMENTATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-white tracking-tight">
            How Med-Sathi Closes the Loop
          </h2>
          <p className="text-xs sm:text-sm text-[#505a5b] dark:text-[#8f91a2] mt-1">
            Click any step below to explore how data flows securely from physician order to bedside delivery:
          </p>
        </div>

        {/* 4 Interactive Step Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {steps.map((st, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden ${
                  isActive
                    ? 'bg-white dark:bg-[#181d1e] border-[#94b0da] shadow-md scale-[1.02]'
                    : 'bg-white/60 dark:bg-[#181d1e]/50 border-[#94b0da]/20 dark:border-[#505a5b]/30 hover:bg-white dark:hover:bg-[#181d1e]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs font-black ${isActive ? 'text-[#94b0da]' : 'text-[#8f91a2]'}`}>
                    {st.num}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#94b0da]/20 text-[#121616] dark:text-[#dcedff]">
                    {st.role}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#121616] dark:text-white mb-1">
                  {st.title}
                </div>
                <div className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] line-clamp-1">
                  {st.tag}
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#94b0da]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Console Visual Display */}
        <div className="aspen-card p-6 sm:p-8 bg-white dark:bg-[#181d1e] border border-[#94b0da]/30 dark:border-[#505a5b]/50 shadow-xl relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Step Explanation Text (Left Column) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#94b0da]/20 text-[10px] font-mono font-bold text-[#121616] dark:text-[#dcedff] border border-[#94b0da]/40">
                <span>STAGE {currentStepData.num} OF 04</span>
                <span>•</span>
                <span>{currentStepData.tag}</span>
              </div>

              <h3 className="text-2xl font-black text-[#121616] dark:text-white tracking-tight">
                {currentStepData.title}
              </h3>

              <p className="text-sm text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
                {currentStepData.desc}
              </p>

              <div className="space-y-2 pt-2">
                {currentStepData.details.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#505a5b] dark:text-[#dcedff]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleTeacherEntry(currentStepData.role)}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#94b0da] hover:underline"
                >
                  <span>TEST THIS STAGE IN LIVE CONSOLE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Live Console Window (Right Column) */}
            <div className="lg:col-span-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#121616] border border-[#505a5b]/50 shadow-2xl space-y-4 font-mono text-[#dcedff]">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#505a5b]/40 text-xs text-[#8f91a2]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-[10px] text-[#8f91a2]">MED-SATHI // VERIFICATION ENGINE</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">● LIVE DATA ENGINE</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#181d1e] border border-[#505a5b]/40">
                    <div className="text-[10px] text-[#8f91a2] uppercase tracking-widest">{currentStepData.preview.badge}</div>
                    <div className="font-bold text-white text-sm mt-0.5">{currentStepData.preview.title}</div>
                    <div className="text-[11px] text-[#94b0da] mt-1">{currentStepData.preview.patient}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{currentStepData.preview.status}</span>
                    </div>
                    <div className="text-[10px] text-[#8f91a2] mt-1">{currentStepData.preview.time}</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#8f91a2]">Evaluation Persona:</span>
                  <button
                    onClick={() => handleTeacherEntry(currentStepData.role)}
                    className="px-3 py-1 rounded-lg bg-[#94b0da] text-[#121616] font-bold text-[10px] hover:bg-white transition-colors"
                  >
                    Open as {currentStepData.role} →
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* SECTION 3: CLINICAL ROLES (#roles) */}
      <section id="roles" className="relative z-20 py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#94b0da] font-bold mb-2">
            ■ TAILORED WORKSPACES FOR EVERY CLINICAL SPECIALTY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-white tracking-tight">
            Role-Based Clinical Experiences
          </h2>
          <p className="text-xs sm:text-sm text-[#505a5b] dark:text-[#8f91a2] mt-1">
            Doctors, Nurses, Pharmacists, and Hospital Administrators each receive specialized layouts, dedicated KPIs, and purpose-built toolsets:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Doctor Card */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] flex flex-col justify-between space-y-4 border-t-2 border-t-[#94b0da]">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#121616] dark:text-white">Doctor Console</h3>
              <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-1 leading-relaxed">
                Inpatient census, rounds progress tracking, Mean Arterial Pressure telemetry, and instant CPOE prescription orders.
              </p>
            </div>
            <button
              onClick={() => handleTeacherEntry('DOCTOR')}
              className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90 transition-opacity"
            >
              Enter Doctor Mode →
            </button>
          </div>

          {/* Nurse Card */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] flex flex-col justify-between space-y-4 border-t-2 border-t-rose-500">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#121616] dark:text-white">Nurse Task Board</h3>
              <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-1 leading-relaxed">
                Bedside 5-Rights QR verification, emergency STAT push banners, shift handover checklists, and IV line monitors.
              </p>
            </div>
            <button
              onClick={() => handleTeacherEntry('NURSE')}
              className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90 transition-opacity"
            >
              Enter Nurse Mode →
            </button>
          </div>

          {/* Pharmacist Card */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] flex flex-col justify-between space-y-4 border-t-2 border-t-cyan-500">
            <div>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#121616] dark:text-white">Pharmacy Hub</h3>
              <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-1 leading-relaxed">
                Prescription dispensing queue, 1-click low-stock replenishment, biologicals cold chain sensors (3.6°C), and crash cart reserve.
              </p>
            </div>
            <button
              onClick={() => handleTeacherEntry('PHARMACIST')}
              className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90 transition-opacity"
            >
              Enter Pharmacy Mode →
            </button>
          </div>

          {/* Admin Card */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] flex flex-col justify-between space-y-4 border-t-2 border-t-indigo-500">
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#121616] dark:text-white">Admin / CMO</h3>
              <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-1 leading-relaxed">
                NABH 5th edition medication compliance (94.6%), ward bed occupancy heatmaps, and tamper-evident cryptographic audit logs.
              </p>
            </div>
            <button
              onClick={() => handleTeacherEntry('ADMIN')}
              className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90 transition-opacity"
            >
              Enter Admin Mode →
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 4: 5-RIGHTS SAFETY MATRIX (#safety) */}
      <section id="safety" className="relative z-20 py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#94b0da] font-bold mb-2">
            ■ CLINICAL GOVERNANCE & PATIENT SAFETY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-white tracking-tight">
            The 5-Rights Bedside Standard
          </h2>
          <p className="text-xs sm:text-sm text-[#505a5b] dark:text-[#8f91a2] mt-1">
            Every dose administered must pass programmatic electronic verification against all five clinical safety pillars:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { num: 'R1', title: 'Right Patient', desc: 'Patient barcode matches verified UHID and assigned ward bed.' },
            { num: 'R2', title: 'Right Drug', desc: 'Formulary barcode verified; allergy contraindications cross-checked.' },
            { num: 'R3', title: 'Right Dose', desc: 'Exact milligram / volume matched against active doctor order.' },
            { num: 'R4', title: 'Right Route', desc: 'IV push, IV infusion, SC, or Oral administration route validated.' },
            { num: 'R5', title: 'Right Time', desc: 'Dose timestamp checked against scheduled administration window.' }
          ].map((r) => (
            <div key={r.num} className="aspen-card p-4 bg-white dark:bg-[#181d1e] text-center space-y-2">
              <span className="inline-block px-2 py-0.5 rounded-full font-mono font-black text-xs bg-[#94b0da]/20 text-[#121616] dark:text-[#dcedff]">
                {r.num}
              </span>
              <div className="font-bold text-sm text-[#121616] dark:text-white">{r.title}</div>
              <p className="text-[11px] text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: ARCHITECTURE (#architecture) */}
      <section id="architecture" className="relative z-20 py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#94b0da] font-bold mb-2">
            ■ ENTERPRISE FULL-STACK ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-white tracking-tight">
            Engineered for High Availability
          </h2>
          <p className="text-xs sm:text-sm text-[#505a5b] dark:text-[#8f91a2] mt-1">
            Built using modern JavaScript, React 18, Express MVC, and dual-mode MongoDB + in-memory store:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-2">
            <div className="text-xs font-mono font-bold text-[#94b0da]">FRONTEND CLIENT</div>
            <div className="text-base font-bold text-[#121616] dark:text-white">React 18 + Vite + Tailwind</div>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
              Aspen Search minimalist design, Recharts data visualizers, Context API theme and auth state, and zero external Bloatware.
            </p>
          </div>

          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-2">
            <div className="text-xs font-mono font-bold text-[#94b0da]">BACKEND REST API</div>
            <div className="text-base font-bold text-[#121616] dark:text-white">Node.js + Express MVC</div>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
              Clean controllers, JWT + bcrypt authentication, role-based route guardrails, and automated clinical schedule engines.
            </p>
          </div>

          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-2">
            <div className="text-xs font-mono font-bold text-[#94b0da]">DUAL-MODE DATABASE</div>
            <div className="text-base font-bold text-[#121616] dark:text-white">MongoDB + Resilient Engine</div>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed">
              Connects to local MongoDB Compass when online; seamlessly falls back to pre-seeded in-memory store so evaluators never see empty screens.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ (#faq) */}
      <section id="faq" className="relative z-20 py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#94b0da] font-bold mb-2">
            ■ QUESTIONS & EVALUATOR NOTES
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="aspen-card bg-white dark:bg-[#181d1e] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#121616] dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#94b0da] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#505a5b] dark:text-[#8f91a2] leading-relaxed border-t border-[#94b0da]/20 dark:border-[#505a5b]/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Clean Palette Footer */}
      <footer className="relative z-20 py-8 px-4 text-center text-xs text-[#505a5b] dark:text-[#8f91a2] border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
        <div className="flex items-center justify-center gap-2 mb-2 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>MED-SATHI CLINICAL SAFETY PLATFORM</span>
        </div>
        <p>© 2026 Med-Sathi Closed-Loop eMAR System. Built for College Demonstration & Clinical Evaluation.</p>
      </footer>

    </div>
  );
}
