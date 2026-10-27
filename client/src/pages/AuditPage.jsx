import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FALLBACK_AUDIT_LOGS } from '../api/mockFallbackData';
import {
  FileText, Search, Filter, ShieldCheck, Clock, User,
  CheckCircle2, AlertTriangle, Zap, Download
} from 'lucide-react';

export function AuditPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState(FALLBACK_AUDIT_LOGS);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.audit.getLogs({
        role: selectedRole,
        search,
        limit: 150
      });
      setLogs(res.data || []);
    } catch (err) {
      showToast('Could not load clinical audit trail', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedRole, search]);

  const roles = ['ALL', 'DOCTOR', 'NURSE', 'ADMIN', 'PHARMACIST'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-powder-blue/20 dark:border-charcoal/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/40">
              TAMPER-EVIDENT CLINICAL AUDIT TRAIL
            </span>
            <span className="text-[11px] font-mono text-charcoal dark:text-lavender-grey">
              NABH COMPLIANT ACTIVITY LOG
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-onyx dark:text-alice-blue tracking-tight uppercase">
            Clinical Traceability Log
          </h1>
          <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey mt-0.5">
            Immutable log of all bedside barcode scans, medication administrations, STAT emergencies, and physician orders
          </p>
        </div>

        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
            const dl = document.createElement('a');
            dl.setAttribute("href", dataStr);
            dl.setAttribute("download", `medsathi_audit_trail_${Date.now()}.json`);
            dl.click();
            showToast('Audit trail exported successfully.', 'success', 'Export Complete');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 bg-white dark:bg-[#181d1e] text-xs font-mono font-bold text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue hover:border-powder-blue transition-all"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT LOGS (JSON)</span>
        </button>
      </div>

      {/* Role Filter and Search Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl aspen-card bg-white dark:bg-[#181d1e]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          <span className="font-mono text-[10px] uppercase text-charcoal dark:text-lavender-grey pl-1 flex-shrink-0">
            ROLE:
          </span>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRole === r
                  ? 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold'
                  : 'bg-alice-blue/40 dark:bg-charcoal/30 text-charcoal dark:text-lavender-grey hover:bg-powder-blue/30'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clinician, patient, action..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-alice-blue/30 dark:bg-[#141819] border border-powder-blue/30 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-1 focus:ring-powder-blue"
          />
          <Search className="w-3.5 h-3.5 text-charcoal dark:text-lavender-grey absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Audit Log Events List */}
      <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-3">
        <div className="flex items-center justify-between border-b border-powder-blue/20 dark:border-charcoal/40 pb-3">
          <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey font-bold">
            ■ RECORDED CLINICAL TRANSACTIONS ({logs.length})
          </span>
        </div>

        <div className="space-y-2.5">
          {logs.map((log) => {
            const isStat = log.action.includes('STAT');
            const isMed = log.action.includes('MEDICATION');
            const isRx = log.action.includes('PRESCRIPTION');

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-powder-blue/20 dark:border-charcoal/40 bg-white dark:bg-[#161a1b] hover:border-powder-blue/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
                    isStat
                      ? 'bg-rose-500/10 text-rose-500'
                      : isMed
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-powder-blue/20 text-onyx dark:text-alice-blue'
                  }`}>
                    {isStat ? <Zap className="w-4 h-4" /> : isMed ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-onyx dark:text-alice-blue uppercase">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-powder-blue/20 text-onyx dark:text-alice-blue">
                        {log.userRole}
                      </span>
                      {log.patientName && (
                        <span className="text-[11px] text-charcoal dark:text-lavender-grey">
                          Inpatient: <strong>{log.patientName}</strong>
                        </span>
                      )}
                    </div>

                    <p className="text-charcoal dark:text-lavender-grey leading-relaxed">
                      {log.details}
                    </p>

                    <div className="text-[11px] font-mono text-charcoal/70 dark:text-lavender-grey/70 pt-0.5">
                      Logged by: <strong className="text-onyx dark:text-alice-blue">{log.userName}</strong> ({log.userId})
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono text-[11px] text-charcoal dark:text-lavender-grey">
                  {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

