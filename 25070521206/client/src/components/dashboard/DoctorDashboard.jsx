import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Stethoscope, AlertTriangle, ShieldCheck, Heart,
  Activity, ArrowRight, Zap, CheckCircle2, Clock, FileText,
  ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, CartesianGrid, LineChart, Line
} from 'recharts';

export function DoctorDashboard({ patients, analytics, onOpenAiModal }) {
  const navigate = useNavigate();

  // Acuity rounds checklist state
  const [roundsStatus, setRoundsStatus] = useState({
    'PAT-001': true,  // Rajesh Verma (ARDS) - Reviewed
    'PAT-002': true,  // Sunita Sharma - Reviewed
    'PAT-003': false, // Ananya Sen - Pending
    'PAT-004': false, // Vikram Malhotra - Pending
    'PAT-005': true,  // Aarav Joshi - Reviewed
    'PAT-006': false  // Meera Patel - Pending
  });

  const toggleRound = (id) => {
    setRoundsStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const criticalPatients = patients.filter(p =>
    p.ward === 'ICU' ||
    p.ward === 'Cardiology' ||
    (p.vitals?.spo2 && p.vitals.spo2 < 95) ||
    (p.vitals?.bp && parseInt(p.vitals.bp) < 100)
  );

  const pendingRoundsCount = Object.values(roundsStatus).filter(v => !v).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Doctor Specialization Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              ■ ATTENDING PHYSICIAN ACTIVE CLINICAL CONSOLE
            </div>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
              You have <span className="font-bold text-[#121616] dark:text-[#dcedff]">{pendingRoundsCount} patients</span> awaiting morning bedside round completion in ICU and Cardiology.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiModal}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-mono tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI RISK PREDICTOR</span>
          </button>
          <Link
            to="/prescriptions"
            className="px-3 py-1.5 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] text-xs font-bold font-mono tracking-wider transition-colors"
          >
            + ISSUE RX / STAT
          </Link>
        </div>
      </div>

      {/* Doctor Specific KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-[#94b0da]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              01 / ASSIGNED INPATIENTS
            </span>
            <Users className="w-4 h-4 text-[#94b0da]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-[#dcedff]">
            {patients.length}
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            2 ICU • 1 Cardiology • 3 Wards
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-rose-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              02 / HIGH ACUITY TELEMETRY
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            {criticalPatients.length}
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Patients Requiring Frequent Vitals Watch
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              03 / ROUNDS PROGRESS
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {patients.length - pendingRoundsCount} / {patients.length}
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            {Math.round(((patients.length - pendingRoundsCount) / (patients.length || 1)) * 100)}% Rounds Completed
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              04 / STAT ORDERS ISSUED
            </span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            2 ACTIVE
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Furosemide & Noradrenaline Infusion
          </span>
        </div>

      </div>

      {/* Main Clinical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Inpatient Acuity Census & Vitals Watch */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Patient Acuity Census Table */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ PHYSICIAN INPATIENT CENSUS
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  Assigned Patients, Diagnosis & Vitals
                </h3>
              </div>
              <Link
                to="/patients"
                className="text-xs font-mono font-bold text-[#94b0da] hover:underline flex items-center gap-1"
              >
                <span>ALL PATIENTS</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#94b0da]/20 dark:border-[#505a5b]/40 text-[#505a5b] dark:text-[#8f91a2] font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Patient & UHID</th>
                    <th className="pb-3 font-bold">Ward / Bed</th>
                    <th className="pb-3 font-bold">Primary Diagnosis</th>
                    <th className="pb-3 font-bold">Live Vitals</th>
                    <th className="pb-3 font-bold text-center">Round</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94b0da]/10 dark:divide-[#505a5b]/30">
                  {patients.map((p) => {
                    const isCritical = p.ward === 'ICU' || (p.vitals?.spo2 && p.vitals.spo2 < 95);
                    const isRoundDone = roundsStatus[p.id];

                    return (
                      <tr key={p.id} className="hover:bg-[#dcedff]/20 dark:hover:bg-[#141819]/50 transition-colors">
                        <td className="py-3.5 pr-2">
                          <div className="font-bold text-[#121616] dark:text-[#dcedff] flex items-center gap-1.5">
                            {p.name}
                            {isCritical && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Critical Acuity" />
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-[#505a5b] dark:text-[#8f91a2]">
                            {p.uhid} • {p.age}y / {p.gender}
                          </div>
                        </td>

                        <td className="py-3.5 pr-2 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.ward === 'ICU'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : 'bg-[#94b0da]/20 text-[#121616] dark:text-[#dcedff]'
                          }`}>
                            {p.ward} ({p.bed})
                          </span>
                        </td>

                        <td className="py-3.5 pr-2 text-[#505a5b] dark:text-[#8f91a2] max-w-[200px] truncate" title={p.diagnosis}>
                          {p.diagnosis}
                        </td>

                        <td className="py-3.5 pr-2 font-mono text-[11px]">
                          <div className={p.vitals?.spo2 < 95 ? 'text-rose-600 font-bold' : 'text-[#121616] dark:text-[#dcedff]'}>
                            SpO2: {p.vitals?.spo2 || 98}%
                          </div>
                          <div className="text-[10px] text-[#505a5b] dark:text-[#8f91a2]">
                            BP: {p.vitals?.bp || '120/80'} • HR: {p.vitals?.hr || 75}
                          </div>
                        </td>

                        <td className="py-3.5 pr-2 text-center">
                          <button
                            onClick={() => toggleRound(p.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                              isRoundDone
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                            }`}
                          >
                            {isRoundDone ? '✓ REVIEWED' : 'PENDING'}
                          </button>
                        </td>

                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => navigate(`/prescriptions?patientId=${p.id}`)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90"
                          >
                            PRESCRIBE
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Vitals Trend Chart */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ PATIENT HEMODYNAMIC MONITORING
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  ICU / High-Acuity Mean Arterial Pressure & Pulse Trends
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-[#dcedff]/50 dark:bg-[#121616]/50 text-[#505a5b] dark:text-[#8f91a2]">
                TELEMETRY SYNCED
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { time: '02:00', map: 62, hr: 108, targetMap: 65 },
                    { time: '04:00', map: 64, hr: 104, targetMap: 65 },
                    { time: '06:00', map: 68, hr: 98, targetMap: 65 },
                    { time: '08:00', map: 72, hr: 94, targetMap: 65 },
                    { time: '10:00', map: 74, hr: 92, targetMap: 65 },
                    { time: '12:00', map: 75, hr: 88, targetMap: 65 },
                    { time: '14:00', map: 73, hr: 86, targetMap: 65 }
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="mapGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94b0da" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#94b0da" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 176, 218, 0.2)" />
                  <XAxis dataKey="time" stroke="#8f91a2" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 120]} stroke="#8f91a2" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#181d1e',
                      borderColor: '#505a5b',
                      borderRadius: '0.75rem',
                      color: '#dcedff',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="map" name="Mean Arterial Pressure (mmHg)" stroke="#94b0da" strokeWidth={2} fillOpacity={1} fill="url(#mapGrad)" />
                  <Line type="monotone" dataKey="hr" name="Heart Rate (bpm)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="targetMap" name="MAP Target (65 mmHg)" stroke="#ef4444" strokeDasharray="4 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Doctor Quick Tools & Safety Alerts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Doctor Actions Card */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
              ■ CLINICAL ORDER SHORTCUTS
            </span>
            <div className="space-y-2">
              <Link
                to="/prescriptions"
                className="w-full py-2.5 px-3 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] font-mono font-bold text-xs tracking-wider flex items-center justify-between hover:opacity-90 transition-opacity"
              >
                <span>+ NEW PRESCRIPTION ORDER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/medications?tab=STAT"
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-mono font-bold text-xs tracking-wider flex items-center justify-between transition-colors"
              >
                <span>URGENT STAT PUSH QUEUE</span>
                <Zap className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={onOpenAiModal}
                className="w-full py-2.5 px-3 rounded-xl bg-[#dcedff]/60 dark:bg-[#141819] text-[#121616] dark:text-[#dcedff] border border-[#94b0da]/40 font-mono font-bold text-xs tracking-wider flex items-center justify-between hover:bg-[#94b0da]/20 transition-colors"
              >
                <span>RUN AI DELAY RISK ANALYSIS</span>
                <Sparkles className="w-3.5 h-3.5 text-[#94b0da]" />
              </button>
            </div>
          </div>

          {/* Allergy & Safety Alert Guardrail Box */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-l-4 border-l-rose-500 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-mono font-bold uppercase text-[#121616] dark:text-[#dcedff]">
                CRITICAL ALLERGY FLAGS
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[#505a5b] dark:text-[#8f91a2]">
                <div className="font-bold text-[#121616] dark:text-[#dcedff]">Rajesh Verma (ICU-03)</div>
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono font-semibold">
                  Allergies: Penicillin, Sulfa
                </div>
                <div className="text-[10px] text-[#8f91a2] mt-0.5">Avoid Cephalosporin cross-sensitivity.</div>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[#505a5b] dark:text-[#8f91a2]">
                <div className="font-bold text-[#121616] dark:text-[#dcedff]">Meera Patel (ICU-01)</div>
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono font-semibold">
                  Allergies: Morphine
                </div>
                <div className="text-[10px] text-[#8f91a2] mt-0.5">Use Fentanyl for ACLS analgesia.</div>
              </div>
            </div>
          </div>

          {/* Doctor Today Round Summary */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
              ■ SHIFT ROUNDING TARGETS
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[#505a5b] dark:text-[#8f91a2]">
                <span>ICU High Dependency:</span>
                <span className="font-mono font-bold text-[#121616] dark:text-[#dcedff]">1 / 2 Completed</span>
              </div>
              <div className="flex items-center justify-between text-[#505a5b] dark:text-[#8f91a2]">
                <span>Cardiology Unit:</span>
                <span className="font-mono font-bold text-[#121616] dark:text-[#dcedff]">0 / 1 Completed</span>
              </div>
              <div className="flex items-center justify-between text-[#505a5b] dark:text-[#8f91a2]">
                <span>Surgical Post-Op:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">1 / 1 Completed</span>
              </div>
              <div className="flex items-center justify-between text-[#505a5b] dark:text-[#8f91a2]">
                <span>General & Pediatric:</span>
                <span className="font-mono font-bold text-[#121616] dark:text-[#dcedff]">1 / 2 Completed</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

