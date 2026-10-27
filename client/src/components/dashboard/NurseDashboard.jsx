import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList, Clock, Zap, CheckCircle2, AlertTriangle,
  QrCode, ArrowRight, UserCheck, ShieldAlert, Check,
  AlertCircle, Sparkles, Filter
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid
} from 'recharts';

export function NurseDashboard({ schedules, patients, onOpenAiModal, onOpenCodeBlue }) {
  const navigate = useNavigate();

  // Shift Checklist State
  const [checklist, setChecklist] = useState({
    crashCartChecked: true,
    ivInfusionPumpsCalibrated: true,
    highAlertMedsDoubleChecked: false,
    bedsideWristbandScannersSynced: true,
    narcoticsCountCompleted: true
  });

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const dueSchedules = schedules.filter(s => s.status === 'DUE' || s.isStat || s.status === 'OVERDUE');
  const statList = schedules.filter(s => s.isStat && (s.status === 'DUE' || s.status === 'OVERDUE'));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Nurse Urgent Shift Alert Banner */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
          <div>
            <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              ■ NURSE STATION LIVE TASK BOARD — MORNING SHIFT (07:00 - 15:00)
            </div>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
              <span className="font-bold text-[#121616] dark:text-[#dcedff]">{statList.length} STAT doses</span> require immediate bedside push. 5-Rights bedside barcode scanning mandatory.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/medications?tab=STAT"
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono tracking-wider transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>PUSH STAT QUEUE</span>
          </Link>
          <Link
            to="/medications"
            className="px-3 py-1.5 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] text-xs font-bold font-mono tracking-wider transition-colors"
          >
            OPEN eMAR →
          </Link>
        </div>
      </div>

      {/* Nurse 4 Distinct KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-rose-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              01 / STAT URGENT PUSH
            </span>
            <Zap className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            {statList.length}
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Furosemide & Noradrenaline
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-[#94b0da]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              02 / DUE IN NEXT 60 MINS
            </span>
            <Clock className="w-4 h-4 text-[#94b0da]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-[#dcedff]">
            3 DOSES
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            ICU-03, ICU-01, SW-07 Beds
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              03 / OVERDUE WARNING
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            1 DOSE
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Enoxaparin LMWH in CARD-02
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              04 / SHIFT 5-RIGHTS SCAN RATE
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            96.8%
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Zero Medication Near-Misses
          </span>
        </div>

      </div>

      {/* Main Nurse Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Immediate Administration Queue & Shift Volume */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bedside Administration Queue */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ PRIORITY BEDSIDE ADMINISTRATION QUEUE
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  Scheduled Doses Due for Delivery
                </h3>
              </div>
              <Link
                to="/medications"
                className="text-xs font-mono font-bold text-[#94b0da] hover:underline flex items-center gap-1"
              >
                <span>FULL eMAR BOARD</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {dueSchedules.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.isStat
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : item.status === 'OVERDUE'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-[#dcedff]/20 dark:bg-[#141819] border-[#94b0da]/30 dark:border-[#505a5b]/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.isStat ? 'bg-rose-600 text-white animate-pulse' :
                        item.status === 'OVERDUE' ? 'bg-amber-500 text-white' :
                        'bg-[#94b0da]/30 text-[#121616] dark:text-[#dcedff]'
                      }`}>
                        {item.isStat ? '⚡ STAT IMMEDIATE' : item.status}
                      </span>
                      <span className="font-bold text-sm text-[#121616] dark:text-[#dcedff]">
                        {item.medicine} {item.dose}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono font-bold">
                        {item.route}
                      </span>
                    </div>

                    <div className="text-xs text-[#505a5b] dark:text-[#8f91a2] flex items-center gap-2">
                      <span className="font-semibold text-[#121616] dark:text-[#dcedff]">
                        Patient: {item.patientName}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{item.patientWard} ({item.patientBed})</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-[#8f91a2]">
                        Scheduled: {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/medications?tab=DUE&verifyId=${item.id}`}
                      className="px-3.5 py-2 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] font-mono font-bold text-xs tracking-wider flex items-center gap-1.5 hover:opacity-90 shadow-sm transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>ADMINISTER</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Shift Dosing Chart */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ NURSE ROUND TIMELINESS
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  Shift Dose Administration Volume (Morning Round)
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-[#dcedff]/50 dark:bg-[#121616]/50 text-[#505a5b] dark:text-[#8f91a2]">
                NABH ON-TIME COMPLIANCE
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { hour: '07:00', administered: 6, delayed: 0 },
                    { hour: '08:00', administered: 14, delayed: 1 },
                    { hour: '09:00', administered: 10, delayed: 0 },
                    { hour: '10:00', administered: 8, delayed: 1 },
                    { hour: '11:00', administered: 5, delayed: 0 },
                    { hour: '12:00', administered: 12, delayed: 0 },
                    { hour: '13:00', administered: 7, delayed: 0 }
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 176, 218, 0.2)" />
                  <XAxis dataKey="hour" stroke="#8f91a2" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8f91a2" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#181d1e',
                      borderColor: '#505a5b',
                      borderRadius: '0.75rem',
                      color: '#dcedff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="administered" name="Administered on Schedule" fill="#94b0da" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delayed" name="Delayed (Reported)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Shift Protocol Checklist & Quick Bedside Tools */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Bedside Scan & ACLS Trigger */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
              ■ BEDSIDE SHORTCUTS
            </span>
            <div className="space-y-2">
              <Link
                to="/medications"
                className="w-full py-2.5 px-3 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] font-mono font-bold text-xs tracking-wider flex items-center justify-between hover:opacity-90"
              >
                <span>OPEN BEDSIDE QR SCANNER</span>
                <QrCode className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={onOpenCodeBlue}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-mono font-bold text-xs tracking-wider flex items-center justify-between transition-colors"
              >
                <span>TRIGGER CODE BLUE RESUSCITATION</span>
                <ShieldAlert className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Shift Handover Safety Checklist */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
                ■ SHIFT LEAD HANDOVER PROTOCOL
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                4/5 DONE
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {Object.entries({
                crashCartChecked: 'Crash Cart & Defibrillator Seal Verified',
                ivInfusionPumpsCalibrated: 'IV Infusion Pump Lines & Flow Calibrated',
                highAlertMedsDoubleChecked: 'High-Alert Vasopressors Double Witnessed',
                bedsideWristbandScannersSynced: 'Wristband Barcode Scanners Online',
                narcoticsCountCompleted: 'Controlled Narcotics Shift Tally Balanced'
              }).map(([key, label]) => {
                const isChecked = checklist[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleCheck(key)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#dcedff]/20 dark:bg-[#141819] hover:bg-[#94b0da]/20 text-left transition-colors"
                  >
                    <span className={`text-xs ${isChecked ? 'line-through text-[#8f91a2]' : 'text-[#121616] dark:text-[#dcedff] font-medium'}`}>
                      {label}
                    </span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#94b0da]'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active IV Infusion Lines Monitor */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
              ■ CRITICAL CONTINUOUS INFUSIONS
            </span>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#dcedff]/30 dark:bg-[#141819] border border-[#94b0da]/30">
                <div className="font-bold text-[#121616] dark:text-[#dcedff] flex items-center justify-between">
                  <span>Noradrenaline 4 mcg/min</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                    TITRATION ACTIVE
                  </span>
                </div>
                <div className="text-[11px] text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
                  Patient: Meera Patel (ICU-01) • Central Line Bay 1
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#dcedff]/30 dark:bg-[#141819] border border-[#94b0da]/30">
                <div className="font-bold text-[#121616] dark:text-[#dcedff] flex items-center justify-between">
                  <span>Meropenem 1g in 100mL NS</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                    RUNNING (20m left)
                  </span>
                </div>
                <div className="text-[11px] text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
                  Patient: Rajesh Verma (ICU-03) • Infusion rate 200 mL/hr
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

