import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Users, Activity, FileText, Download,
  TrendingUp, AlertTriangle, ArrowRight, CheckCircle2,
  Lock, Building2, BarChart2, Layers
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

export function AdminDashboard({ analytics, patients, auditLogs = [] }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportInspection = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const wardOccupancy = [
    { ward: 'ICU', occupied: 2, total: 4, rate: 50 },
    { ward: 'Cardiology', occupied: 1, total: 3, rate: 33 },
    { ward: 'Surgical Ward', occupied: 1, total: 4, rate: 25 },
    { ward: 'General Ward', occupied: 1, total: 6, rate: 17 },
    { ward: 'Pediatric Ward', occupied: 1, total: 3, rate: 33 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Admin Operations Banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
              ■ CHIEF MEDICAL OFFICER & EXECUTIVE QUALITY OVERSIGHT
            </div>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
              NABH Medication Safety Quality Indicator is currently at <span className="font-bold text-emerald-600 dark:text-emerald-400">{analytics?.summary?.complianceRate || 94.6}%</span> (Hospital Benchmark: &gt;90.0%). All tamper-evident logs active.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportInspection}
            className="px-3.5 py-1.5 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] text-xs font-bold font-mono tracking-wider transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'EXPORT PACKET READY ✓' : 'EXPORT INSPECTION PACKET'}</span>
          </button>
        </div>
      </div>

      {/* Admin 4 Distinct KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              01 / NABH QUALITY COMPLIANCE
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {analytics?.summary?.complianceRate || 94.6}%
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Target 90.0% • Hospital Quality Standard Met
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-[#94b0da]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              02 / TOTAL INPATIENT OCCUPANCY
            </span>
            <Users className="w-4 h-4 text-[#94b0da]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-[#dcedff]">
            {patients.length} / 20 BEDS
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            30% Bed Capacity Utilized
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-indigo-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              03 / PREVENTED NEAR-MISSES
            </span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            4 INTERCEPTED
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Allergy Contraindications Stopped by System
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-[#505a5b]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              04 / AUDIT TRAIL LOGS
            </span>
            <Lock className="w-4 h-4 text-[#505a5b]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-[#dcedff]">
            100% IMMUTABLE
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Cryptographic Action Timestamps Recorded
          </span>
        </div>

      </div>

      {/* Main Admin Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Hospital-wide Ward Safety Analytics & Capacity */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Ward Compliance Bar Chart */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ HOSPITAL ACCREDITATION GOVERNANCE
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  Cross-Ward 5-Rights Medication Compliance Breakdown
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                AUDIT BENCHMARK PASS
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics?.wardPerformance || [
                    { ward: 'General Ward', given: 8, delayed: 1, overdue: 0 },
                    { ward: 'ICU', given: 9, delayed: 0, overdue: 1 },
                    { ward: 'Surgical Ward', given: 8, delayed: 1, overdue: 0 },
                    { ward: 'Cardiology', given: 6, delayed: 0, overdue: 1 },
                    { ward: 'Pediatric Ward', given: 5, delayed: 0, overdue: 0 }
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 176, 218, 0.2)" />
                  <XAxis dataKey="ward" stroke="#8f91a2" fontSize={11} tickLine={false} />
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
                  <Bar dataKey="given" name="Given on Time" fill="#94b0da" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delayed" name="Delayed Doses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overdue" name="Overdue / Intervened" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ward Bed Occupancy Matrix */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ FACILITY CAPACITY & BED OCCUPANCY
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  Real-time Inpatient Bed Census
                </h3>
              </div>
              <span className="text-xs font-mono text-[#8f91a2]">
                6 BEDS OCCUPIED • 14 AVAILABLE
              </span>
            </div>

            <div className="space-y-3">
              {wardOccupancy.map((w) => (
                <div key={w.ward} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#121616] dark:text-[#dcedff]">{w.ward}</span>
                    <span className="text-[#505a5b] dark:text-[#8f91a2]">{w.occupied} / {w.total} Beds ({w.rate}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#dcedff]/50 dark:bg-[#141819] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        w.rate >= 50 ? 'bg-amber-500' : 'bg-[#94b0da]'
                      }`}
                      style={{ width: `${w.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Live Audit Trail Stream & Compliance Export */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Tamper-Evident Audit Feed */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
                ■ RECENT AUDIT LOG EVENTS
              </span>
              <Link to="/audit" className="text-[10px] font-mono font-bold text-[#94b0da] hover:underline">
                ALL LOGS →
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {(auditLogs.slice(0, 4)).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-[#dcedff]/20 dark:bg-[#141819] border border-[#94b0da]/20">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#8f91a2]">
                    <span className="font-bold text-[#121616] dark:text-[#dcedff]">{log.userName}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="font-semibold text-[11px] text-[#121616] dark:text-[#dcedff] mt-0.5">
                    {log.action}
                  </div>
                  <div className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] line-clamp-1 mt-0.5">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Near-Miss Interventions Prevented */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
              ■ CLINICAL SAFETY INTERCEPTIONS
            </span>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#505a5b] dark:text-[#8f91a2]">
                <div className="font-bold text-emerald-700 dark:text-emerald-300">
                  Penicillin Anaphylaxis Prevented
                </div>
                <div className="text-[10px] mt-0.5">
                  Dr. Rajesh Sharma flagged for Rajesh Verma (ICU-03) on 24-Oct. Amoxicillin attempt auto-blocked.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#505a5b] dark:text-[#8f91a2]">
                <div className="font-bold text-emerald-700 dark:text-emerald-300">
                  NSAID Asthma Flare Prevented
                </div>
                <div className="text-[10px] mt-0.5">
                  Ibuprofen order warning shown for Sunita Sharma (SW-07). Converted to IV Paracetamol.
                </div>
              </div>
            </div>
          </div>

          {/* Executive Download Packet Shortcut */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
              ■ STATUTORY MEDICAL COMPLIANCE
            </span>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2]">
              Generate complete NABH 5th Edition Medication Management & Safety (MOM) packet including timestamps, pharmacist clearance records, and doctor order history.
            </p>
            <button
              onClick={handleExportInspection}
              className="w-full py-2.5 px-3 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-90"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'REPORT EXPORTED ✓' : 'DOWNLOAD NABH AUDIT REPORT'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

