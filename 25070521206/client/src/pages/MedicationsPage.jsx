import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge, StatBadge, AllergyBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FALLBACK_SCHEDULES } from '../api/mockFallbackData';
import {
  ClipboardList, Clock, Zap, AlertCircle, CheckCircle2,
  Search, Filter, QrCode, ArrowRight, UserCheck, ShieldAlert,
  HeartHandshake, Check, AlertTriangle
} from 'lucide-react';

export function MedicationsPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [schedules, setSchedules] = useState(FALLBACK_SCHEDULES);
  const [counts, setCounts] = useState({ due: 3, upcoming: 2, overdue: 1, completed: 2, stat: 2, total: 8 });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'DUE');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [search, setSearch] = useState('');

  // Administration Modal State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminAction, setAdminAction] = useState('GIVEN');
  const [adminReason, setAdminReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [isQrVerified, setIsQrVerified] = useState(false);
  const [qrError, setQrError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = () => {
    apiClient.medications.getSchedules({ tab: activeTab, ward: selectedWard, search })
      .then(res => {
        if (res?.data && res.data.length > 0) setSchedules(res.data);
        if (res?.counts) setCounts(res.counts);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 12000);
    return () => clearInterval(interval);
  }, [activeTab, selectedWard, search]);

  const handleOpenAdminModal = (item) => {
    setSelectedItem(item);
    setAdminAction('GIVEN');
    setAdminReason('');
    setAdminNotes('');
    setQrCodeInput(item.patientQrCode || '');
    setIsQrVerified(false);
    setQrError('');
    setAdminModalOpen(true);
  };

  const handleVerifyQr = async () => {
    if (!selectedItem) return;
    try {
      const res = await apiClient.medications.verifyQr({
        scheduleId: selectedItem.id,
        scannedQr: qrCodeInput
      });

      if (res.verification?.patientMatched) {
        setIsQrVerified(true);
        setQrError('');
        showToast('5-Rights Bedside Match Confirmed: Right Patient, Right Drug, Right Dose, Right Route, Right Time.', 'success', 'Verification Unlocked');
      } else {
        setIsQrVerified(false);
        setQrError('Barcode mismatch! The scanned code does not match this inpatient identity.');
        showToast('Barcode mismatch! Do not administer.', 'error', 'Safety Interception');
      }
    } catch (err) {
      setQrError(err.message);
    }
  };

  const handleSubmitAdministration = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (adminAction !== 'GIVEN' && !adminReason) {
      showToast('Clinical reason is mandatory for Delayed, Held, or Refused doses.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.medications.administer({
        scheduleId: selectedItem.id,
        action: adminAction,
        reason: adminReason,
        notes: adminNotes,
        administeredBy: currentUser?.name || 'Nurse Priya Patel',
        administeredByRole: currentUser?.role || 'NURSE',
        userId: currentUser?.id || 'USR-NURSE-01'
      });

      if (res.success) {
        showToast(`Dose recorded as ${adminAction}. Audit trail updated.`, 'success', 'Administration Complete');
        setAdminModalOpen(false);
        setSelectedItem(null);
        fetchSchedules();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: 'DUE', label: 'Due Now', count: counts.due },
    { key: 'UPCOMING', label: 'Upcoming', count: counts.upcoming },
    { key: 'OVERDUE', label: 'Overdue', count: counts.overdue },
    { key: 'STAT', label: 'STAT Urgent', count: counts.stat },
    { key: 'COMPLETED', label: 'Administered', count: counts.completed },
    { key: 'ALL', label: 'All Tasks', count: counts.total },
  ];

  const wards = ['ALL', 'General Ward', 'ICU', 'Surgical Ward', 'Cardiology', 'Pediatric Ward'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-powder-blue/20 dark:border-charcoal/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/40">
              NURSE TASK BOARD
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-bold">
              ● SHIFT ACTIVE ROUNDS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-onyx dark:text-alice-blue tracking-tight uppercase">
            Closed-Loop Medication Administration
          </h1>
          <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey mt-0.5">
            Right Patient, Right Drug, Right Dose, Right Route, Right Time (5-Rights Verification)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 bg-alice-blue/30 dark:bg-[#141819] text-charcoal dark:text-lavender-grey">
            Lead: <strong className="text-onyx dark:text-alice-blue">{currentUser?.name || 'Nurse Priya'}</strong>
          </span>
        </div>
      </div>

      {/* KPI Shift Task Filter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx shadow-md border-transparent'
                  : 'aspen-card bg-white dark:bg-[#181d1e] text-charcoal dark:text-lavender-grey hover:border-powder-blue'
              }`}
            >
              <span className={`text-[10px] font-mono uppercase tracking-wider block font-bold ${
                isActive ? 'text-powder-blue dark:text-onyx' : 'text-charcoal dark:text-lavender-grey'
              }`}>
                {tab.label}
              </span>
              <div className="text-2xl font-black mt-1">
                {tab.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Ward Filter and Search Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl aspen-card bg-white dark:bg-[#181d1e]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          <span className="font-mono text-[10px] uppercase text-charcoal dark:text-lavender-grey pl-1 flex-shrink-0">
            WARD:
          </span>
          {wards.map((ward) => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedWard === ward
                  ? 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold'
                  : 'bg-alice-blue/40 dark:bg-charcoal/30 text-charcoal dark:text-lavender-grey hover:bg-powder-blue/30'
              }`}
            >
              {ward === 'ALL' ? 'All Wards' : ward}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, bed, or drug..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-alice-blue/30 dark:bg-[#141819] border border-powder-blue/30 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-1 focus:ring-powder-blue"
          />
          <Search className="w-3.5 h-3.5 text-charcoal dark:text-lavender-grey absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Medication Task Board List */}
      <div className="space-y-3">
        {schedules.length === 0 ? (
          <div className="aspen-card p-12 text-center bg-white dark:bg-[#181d1e]">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-bold text-onyx dark:text-alice-blue">
              No pending medication tasks in this category
            </p>
            <span className="text-xs text-charcoal dark:text-lavender-grey mt-0.5 block">
              All scheduled doses for current ward filters have been verified or completed.
            </span>
          </div>
        ) : (
          schedules.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl aspen-card bg-white dark:bg-[#181d1e] flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                item.isStat ? 'border-l-4 border-l-rose-500 ring-1 ring-rose-500/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-alice-blue dark:bg-charcoal text-onyx dark:text-alice-blue flex items-center justify-center font-bold flex-shrink-0">
                  {item.isStat ? <Zap className="w-5 h-5 text-rose-500" /> : <Clock className="w-5 h-5 text-powder-blue" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-onyx dark:text-alice-blue">
                      {item.medicine} ({item.dose})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/30">
                      {item.route}
                    </span>
                    {item.isStat && <StatBadge />}
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="text-xs text-charcoal dark:text-lavender-grey flex flex-wrap items-center gap-3">
                    <span>Inpatient: <strong className="text-onyx dark:text-alice-blue">{item.patientName}</strong> ({item.patientUhid})</span>
                    <span>Ward: <strong className="text-onyx dark:text-alice-blue">{item.patientWard}</strong> • Bed {item.patientBed}</span>
                    <span>Doctor: {item.doctorName}</span>
                  </div>

                  {item.rxInstructions && (
                    <div className="text-[11px] text-charcoal/80 dark:text-lavender-grey/80 italic pt-0.5">
                      Instructions: {item.rxInstructions}
                    </div>
                  )}

                  {item.patientAllergies?.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">ALLERGIES:</span>
                      {item.patientAllergies.map((a, i) => (
                        <AllergyBadge key={i} allergy={a} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-powder-blue/20 dark:border-charcoal/40 flex-shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey block">
                    Scheduled Time
                  </span>
                  <span className="text-xs font-mono font-bold text-onyx dark:text-alice-blue">
                    {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {['DUE', 'OVERDUE', 'UPCOMING'].includes(item.status) ? (
                  <button
                    onClick={() => handleOpenAdminModal(item)}
                    className="px-4 py-2 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide hover:opacity-90 shadow-sm flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Administer Dose</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-charcoal dark:text-lavender-grey">
                    {item.administeredAt ? `Administered at ${new Date(item.administeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : item.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bedside 5-Rights Administration Modal */}
      {selectedItem && (
        <Modal
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          title="Bedside 5-Rights Closed-Loop Administration"
          subtitle={`Administering ${selectedItem.medicine} (${selectedItem.dose}) to ${selectedItem.patientName}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmitAdministration} className="space-y-5">
            
            {/* Step 1: Bedside QR Code Match Check */}
            <div className={`p-4 rounded-xl border transition-all ${
              isQrVerified
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : 'bg-alice-blue/40 dark:bg-[#141819] border-powder-blue/40 dark:border-charcoal/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-onyx dark:text-alice-blue flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-powder-blue" />
                  <span>STEP 1: SCAN PATIENT WRISTBAND BARCODE</span>
                </span>
                {isQrVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>5-RIGHTS VERIFIED</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                    VERIFICATION PENDING
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  placeholder="Scan or paste wristband QR payload..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1c2223] border border-powder-blue/40 dark:border-charcoal/60 text-xs font-mono text-onyx dark:text-alice-blue focus:outline-none focus:ring-1 focus:ring-powder-blue"
                />
                <button
                  type="button"
                  onClick={handleVerifyQr}
                  className="px-4 py-2 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wider hover:opacity-90"
                >
                  Verify Barcode
                </button>
              </div>

              {qrError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-2">
                  {qrError}
                </p>
              )}
            </div>

            {/* 5-Rights Verification Checklist Box */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
              <div className={`p-2.5 rounded-lg border text-center ${isQrVerified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-alice-blue/30 dark:bg-charcoal/20 border-powder-blue/20 text-charcoal dark:text-lavender-grey'}`}>
                <div className="font-bold">RIGHT PATIENT</div>
                <div className="text-[10px] truncate">{selectedItem.patientName}</div>
              </div>
              <div className={`p-2.5 rounded-lg border text-center ${isQrVerified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-alice-blue/30 dark:bg-charcoal/20 border-powder-blue/20 text-charcoal dark:text-lavender-grey'}`}>
                <div className="font-bold">RIGHT DRUG</div>
                <div className="text-[10px] truncate">{selectedItem.medicine}</div>
              </div>
              <div className={`p-2.5 rounded-lg border text-center ${isQrVerified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-alice-blue/30 dark:bg-charcoal/20 border-powder-blue/20 text-charcoal dark:text-lavender-grey'}`}>
                <div className="font-bold">RIGHT DOSE</div>
                <div className="text-[10px] truncate">{selectedItem.dose}</div>
              </div>
              <div className={`p-2.5 rounded-lg border text-center ${isQrVerified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-alice-blue/30 dark:bg-charcoal/20 border-powder-blue/20 text-charcoal dark:text-lavender-grey'}`}>
                <div className="font-bold">RIGHT ROUTE</div>
                <div className="text-[10px] truncate">{selectedItem.route}</div>
              </div>
              <div className={`p-2.5 rounded-lg border text-center ${isQrVerified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-alice-blue/30 dark:bg-charcoal/20 border-powder-blue/20 text-charcoal dark:text-lavender-grey'}`}>
                <div className="font-bold">RIGHT TIME</div>
                <div className="text-[10px] truncate">Scheduled</div>
              </div>
            </div>

            {/* Step 2: Select Action */}
            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                STEP 2: ADMINISTRATION ACTION *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['GIVEN', 'DELAYED', 'HELD', 'REFUSED'].map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setAdminAction(act)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all ${
                      adminAction === act
                        ? 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx border-transparent'
                        : 'bg-alice-blue/30 dark:bg-[#1a1f20] text-charcoal dark:text-lavender-grey border-powder-blue/30 dark:border-charcoal/50'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Mandatory Clinical Reason (if delayed, held, or refused) */}
            {adminAction !== 'GIVEN' && (
              <div>
                <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                  MANDATORY CLINICAL REASON *
                </label>
                <select
                  value={adminReason}
                  onChange={(e) => setAdminReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
                >
                  <option value="">Select Clinical Reason...</option>
                  <option value="Patient asleep / Resting">Patient asleep / Resting</option>
                  <option value="Procedure / Surgery in progress">Procedure / Surgery in progress</option>
                  <option value="Clinical contraindication (Vitals out of range)">Clinical contraindication (Vitals out of range)</option>
                  <option value="Patient refused / Nausea">Patient refused / Nausea</option>
                  <option value="Medication awaiting central pharmacy prep">Medication awaiting central pharmacy prep</option>
                  <option value="Vascular access lost / IV line replacement">Vascular access lost / IV line replacement</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Nurse Shift Notes (Optional)
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Infused via dedicated peripheral IV. Vital signs stable post-dose."
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-powder-blue/20 dark:border-charcoal/40">
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 text-xs font-bold text-charcoal dark:text-lavender-grey"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                {submitting ? 'Recording...' : `Confirm ${adminAction}`}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}

