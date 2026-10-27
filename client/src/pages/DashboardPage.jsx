import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AspenHeroSearch } from '../components/common/AspenHeroSearch';
import {
  FALLBACK_ANALYTICS,
  FALLBACK_PATIENTS,
  FALLBACK_SCHEDULES,
  FALLBACK_INVENTORY,
  FALLBACK_AUDIT_LOGS
} from '../api/mockFallbackData';

// Specialized Role Dashboard Interfaces
import { DoctorDashboard } from '../components/dashboard/DoctorDashboard';
import { NurseDashboard } from '../components/dashboard/NurseDashboard';
import { PharmacistDashboard } from '../components/dashboard/PharmacistDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';

// Modals
import { AiDelayRiskModal } from '../components/ai/AiDelayRiskModal';
import { CodeBlueModal } from '../components/emergency/CodeBlueModal';

import {
  Stethoscope, ClipboardList, Layers, Building2,
  Sparkles, ShieldAlert, ArrowRight, Activity, Zap
} from 'lucide-react';

export function DashboardPage() {
  const { currentUser, switchRole, DEFAULT_USERS } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Unified State
  const [analytics, setAnalytics] = useState(FALLBACK_ANALYTICS);
  const [patients, setPatients] = useState(FALLBACK_PATIENTS);
  const [schedules, setSchedules] = useState(FALLBACK_SCHEDULES);
  const [inventory, setInventory] = useState(FALLBACK_INVENTORY);
  const [auditLogs, setAuditLogs] = useState(FALLBACK_AUDIT_LOGS);

  // Modals
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [codeBlueOpen, setCodeBlueOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [overviewRes, patientsRes, schedRes, invRes, auditRes] = await Promise.allSettled([
        apiClient.analytics.getHospitalOverview(),
        apiClient.patients.getAll(),
        apiClient.medications.getSchedules(),
        apiClient.pharmacy.getInventory(),
        apiClient.audit.getLogs()
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value?.data) {
        setAnalytics(overviewRes.value.data);
      }
      if (patientsRes.status === 'fulfilled' && patientsRes.value?.data && patientsRes.value.data.length > 0) {
        setPatients(patientsRes.value.data);
      }
      if (schedRes.status === 'fulfilled' && schedRes.value?.data && schedRes.value.data.length > 0) {
        setSchedules(schedRes.value.data);
      }
      if (invRes.status === 'fulfilled' && invRes.value?.data && invRes.value.data.length > 0) {
        setInventory(invRes.value.data);
      }
      if (auditRes.status === 'fulfilled' && auditRes.value?.data && auditRes.value.data.length > 0) {
        setAuditLogs(auditRes.value.data);
      }
    } catch (err) {
      console.warn('Dashboard sync background notice:', err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSwitch = (roleKey) => {
    switchRole(roleKey);
    const user = DEFAULT_USERS[roleKey];
    showToast(`Switched interface to ${roleKey} (${user.name})`, 'success', 'Workspace Reconfigured');
  };

  const handleRestock = async (id, newQty) => {
    try {
      await apiClient.pharmacy.updateStock(id, { stockQty: newQty });
      setInventory(prev => prev.map(item => item.id === id ? { ...item, stockQty: newQty, status: 'IN_STOCK' } : item));
      showToast('Inventory restocked +50 units successfully', 'success', 'Pharmacy Stock');
    } catch (err) {
      // Local state update
      setInventory(prev => prev.map(item => item.id === id ? { ...item, stockQty: newQty, status: 'IN_STOCK' } : item));
      showToast('Stock restocked +50 units (Active Store)', 'success', 'Pharmacy Stock');
    }
  };

  const currentRole = currentUser?.role || 'DOCTOR';

  const roleTabs = [
    {
      role: 'DOCTOR',
      label: 'Doctor Console',
      icon: Stethoscope,
      subtitle: 'Dr. Rajesh Sharma • Internal Medicine',
      badge: 'CLINICAL ROUNDS & RX'
    },
    {
      role: 'NURSE',
      label: 'Nurse Task Board',
      icon: ClipboardList,
      subtitle: 'Nurse Priya Patel • Shift Lead (eMAR)',
      badge: '5-RIGHTS & BEDSIDE'
    },
    {
      role: 'PHARMACIST',
      label: 'Pharmacy Hub',
      icon: Layers,
      subtitle: 'Pharmacist Anil Verma • Central Dispensary',
      badge: 'DISPENSING & STOCK'
    },
    {
      role: 'ADMIN',
      label: 'Admin / CMO',
      icon: Building2,
      subtitle: 'Dr. Amitabh Gupta • Quality Director',
      badge: 'NABH & AUDIT GOVERNANCE'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Header & Live Clinical Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#94b0da]/20 dark:border-[#505a5b]/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-[#94b0da]/20 text-[#121616] dark:text-[#dcedff] border border-[#94b0da]/40">
              {currentRole} WORKSPACE ACTIVE
            </span>
            <span className="text-[11px] font-mono text-[#505a5b] dark:text-[#8f91a2] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>NABH SAFETY COMPLIANCE LIVE</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-[#dcedff] tracking-tight uppercase">
            Good morning, {currentUser?.name || 'Dr. Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
            {currentUser?.title || 'Clinical Specialist'} • {currentUser?.department || 'Internal Medicine'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCodeBlueOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>CODE BLUE</span>
          </button>
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#dcedff]/60 dark:bg-[#141819] hover:bg-[#94b0da]/20 text-[#121616] dark:text-[#dcedff] border border-[#94b0da]/40 text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#94b0da]" />
            <span>AI COPILOT</span>
          </button>
        </div>
      </div>

      {/* Prominent Centerpiece Hero Search */}
      <AspenHeroSearch
        onSelectPatient={(patientId) => navigate(`/patients?selected=${patientId}`)}
      />

      {/* DYNAMIC ROLE SWITCHER BAR (PROMINENT TABS TO SWITCH DASHBOARDS IN 1-CLICK) */}
      <div className="p-2 rounded-2xl bg-white dark:bg-[#181d1e] border border-[#94b0da]/30 dark:border-[#505a5b]/50 shadow-sm">
        <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 border-b border-[#94b0da]/20 dark:border-[#505a5b]/30">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#505a5b] dark:text-[#8f91a2] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SELECT WORKSPACE DASHBOARD (1-CLICK ROLE DEMO):</span>
          </span>
          <span className="text-[10px] font-mono text-[#8f91a2] hidden sm:inline">
            Each role renders a completely unique clinical interface
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {roleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentRole === tab.role;

            return (
              <button
                key={tab.role}
                onClick={() => handleRoleSwitch(tab.role)}
                className={`p-3 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] shadow-md scale-[1.01]'
                    : 'bg-[#dcedff]/30 dark:bg-[#141819] hover:bg-[#94b0da]/20 text-[#505a5b] dark:text-[#8f91a2] border border-[#94b0da]/20 dark:border-[#505a5b]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive
                      ? 'bg-white/10 dark:bg-black/10 text-white dark:text-black'
                      : 'bg-[#94b0da]/20 text-[#121616] dark:text-[#dcedff]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                      : 'bg-black/5 dark:bg-white/5 text-[#8f91a2]'
                  }`}>
                    {tab.badge}
                  </span>
                </div>

                <div>
                  <div className={`text-xs font-bold font-mono tracking-tight ${
                    isActive ? 'text-white dark:text-black' : 'text-[#121616] dark:text-[#dcedff]'
                  }`}>
                    {tab.label}
                  </div>
                  <div className={`text-[10px] truncate mt-0.5 ${
                    isActive ? 'text-[#dcedff]/80 dark:text-[#121616]/80' : 'text-[#8f91a2]'
                  }`}>
                    {tab.subtitle}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 dark:bg-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMICALLY RENDERED SPECIALIZED DASHBOARD PER USER ROLE */}
      <div className="transition-all duration-300">
        {currentRole === 'DOCTOR' && (
          <DoctorDashboard
            patients={patients}
            analytics={analytics}
            onOpenAiModal={() => setAiModalOpen(true)}
          />
        )}

        {currentRole === 'NURSE' && (
          <NurseDashboard
            schedules={schedules}
            patients={patients}
            onOpenAiModal={() => setAiModalOpen(true)}
            onOpenCodeBlue={() => setCodeBlueOpen(true)}
          />
        )}

        {currentRole === 'PHARMACIST' && (
          <PharmacistDashboard
            inventory={inventory}
            onRestock={handleRestock}
          />
        )}

        {currentRole === 'ADMIN' && (
          <AdminDashboard
            analytics={analytics}
            patients={patients}
            auditLogs={auditLogs}
          />
        )}
      </div>

      {/* Reusable Clinical Modals */}
      <AiDelayRiskModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        patients={patients}
      />

      <CodeBlueModal
        isOpen={codeBlueOpen}
        onClose={() => setCodeBlueOpen(false)}
      />

    </div>
  );
}
