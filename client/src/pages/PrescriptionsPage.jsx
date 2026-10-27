import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { AllergyBadge, StatBadge } from '../components/common/Badge';
import { FALLBACK_PRESCRIPTIONS, FALLBACK_PATIENTS } from '../api/mockFallbackData';
import {
  Stethoscope, Plus, AlertTriangle, ShieldCheck, Clock,
  Mic, MicOff, Zap, Search, Filter, Ban, Edit, Sparkles, CheckCircle2
} from 'lucide-react';

export function PrescriptionsPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [prescriptions, setPrescriptions] = useState(FALLBACK_PRESCRIPTIONS);
  const [patients, setPatients] = useState(FALLBACK_PATIENTS);
  const [loading, setLoading] = useState(false);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [rxToStop, setRxToStop] = useState(null);
  const [stopReason, setStopReason] = useState('Clinical resolution / Completed course');
  const [ddiModalOpen, setDdiModalOpen] = useState(false);

  // New Prescription Form State
  const [rxForm, setRxForm] = useState({
    patientId: '',
    medicine: '',
    dose: '',
    route: 'IV',
    frequency: 'TDS',
    durationDays: 5,
    startDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    instructions: '',
    isStat: false,
  });

  const [safetyWarnings, setSafetyWarnings] = useState([]);
  const [schedulePreview, setSchedulePreview] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rxRes, patRes] = await Promise.all([
        apiClient.prescriptions.getAll(),
        apiClient.patients.getAll()
      ]);
      setPrescriptions(rxRes.data || []);
      const pats = patRes.data || [];
      setPatients(pats);
      if (pats.length > 0 && !rxForm.patientId) {
        setRxForm(prev => ({ ...prev, patientId: pats[0].id }));
      }
    } catch (err) {
      showToast('Could not load prescriptions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Live Safety Check & Schedule Preview calculation
  useEffect(() => {
    if (!createModalOpen || !rxForm.patientId || !rxForm.medicine) return;

    // 1. Safety Check
    apiClient.prescriptions.safetyCheck({
      patientId: rxForm.patientId,
      medicine: rxForm.medicine,
      dose: rxForm.dose
    })
      .then(res => setSafetyWarnings(res.warnings || []))
      .catch(() => {});

    // 2. Schedule Preview
    apiClient.prescriptions.previewSchedule({
      frequency: rxForm.frequency,
      durationDays: rxForm.durationDays,
      startDate: rxForm.startDate,
      startTime: rxForm.startTime,
      isStat: rxForm.isStat,
      medicine: rxForm.medicine,
      dose: rxForm.dose,
      route: rxForm.route
    })
      .then(res => setSchedulePreview(res.events || []))
      .catch(() => {});
  }, [rxForm.patientId, rxForm.medicine, rxForm.dose, rxForm.frequency, rxForm.durationDays, rxForm.isStat, createModalOpen]);

  // Voice AI Dictation Simulation
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate intelligent voice dictation fallback
      setIsListening(true);
      showToast('Simulating clinical voice extraction...', 'info', 'AI Copilot Voice');
      setTimeout(() => {
        setIsListening(false);
        setRxForm(prev => ({
          ...prev,
          medicine: 'Meropenem Injection',
          dose: '1 g',
          route: 'IV',
          frequency: 'TDS',
          durationDays: 7,
          instructions: 'Infuse slowly over 30 minutes. Monitor renal labs.'
        }));
        showToast('Extracted: Meropenem 1g IV TDS for 7 days', 'success', 'Voice Extracted');
      }, 1500);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      showToast(`Heard: "${transcript}"`, 'info', 'Speech Captured');
      // Simple parse heuristics
      if (transcript.toLowerCase().includes('paracetamol')) {
        setRxForm(prev => ({ ...prev, medicine: 'Paracetamol IV Infusion', dose: '1000 mg', route: 'IV', frequency: 'Q6H' }));
      } else if (transcript.toLowerCase().includes('meropenem')) {
        setRxForm(prev => ({ ...prev, medicine: 'Meropenem Injection', dose: '1 g', route: 'IV', frequency: 'TDS' }));
      } else if (transcript.toLowerCase().includes('pantoprazole')) {
        setRxForm(prev => ({ ...prev, medicine: 'Pantoprazole Injection', dose: '40 mg', route: 'IV', frequency: 'OD' }));
      } else {
        setRxForm(prev => ({ ...prev, instructions: transcript }));
      }
    };

    recognition.start();
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    if (!rxForm.patientId || !rxForm.medicine || !rxForm.dose) {
      showToast('Please fill in Patient, Medicine, and Dose.', 'warning');
      return;
    }

    try {
      const res = await apiClient.prescriptions.create({
        ...rxForm,
        doctorId: currentUser?.id || 'USR-DOC-01',
        doctorName: currentUser?.name || 'Dr. Rajesh Sharma',
      });

      if (res.success) {
        showToast(res.message || 'Prescription created successfully.', 'success', 'Order Verified');
        setCreateModalOpen(false);
        setRxForm({
          patientId: patients[0]?.id || '',
          medicine: '',
          dose: '',
          route: 'IV',
          frequency: 'TDS',
          durationDays: 5,
          startDate: new Date().toISOString().split('T')[0],
          startTime: '08:00',
          instructions: '',
          isStat: false,
        });
        fetchData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleStopPrescription = async () => {
    if (!rxToStop) return;
    try {
      const res = await apiClient.prescriptions.stop(rxToStop.id, {
        stoppedReason: stopReason,
        stoppedBy: currentUser?.name || 'Dr. Rajesh Sharma',
        userId: currentUser?.id || 'USR-DOC-01'
      });
      if (res.success) {
        showToast(res.message, 'info', 'Prescription Discontinued');
        setStopModalOpen(false);
        setRxToStop(null);
        fetchData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-powder-blue/20 dark:border-charcoal/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/40">
              PHYSICIAN e-PRESCRIBING STATION
            </span>
            <span className="text-[11px] font-mono text-charcoal dark:text-lavender-grey">
              ALLERGY INTERCEPTION & SAFETY CHECK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-onyx dark:text-alice-blue tracking-tight uppercase">
            Closed-Loop Medication Orders
          </h1>
          <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey mt-0.5">
            Real-time allergy cross-reactivity mapping, high-alert drug protocols & auto-scheduled dose timelines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDdiModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 text-xs font-mono font-bold text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue hover:bg-alice-blue/40 dark:hover:bg-charcoal/30 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-powder-blue" />
            <span>DDI SAFETY MATRIX</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>New Prescription</span>
          </button>
        </div>
      </div>

      {/* Prescriptions List Table Card */}
      <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-4">
        <div className="flex items-center justify-between border-b border-powder-blue/20 dark:border-charcoal/40 pb-3">
          <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey font-bold">
            ■ ALL HOSPITAL INPATIENT PRESCRIPTIONS ({prescriptions.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-powder-blue/20 dark:border-charcoal/40 font-mono text-[11px] text-charcoal dark:text-lavender-grey">
                <th className="py-2.5 pr-4">PATIENT</th>
                <th className="py-2.5 px-4">MEDICATION</th>
                <th className="py-2.5 px-4">DOSE & ROUTE</th>
                <th className="py-2.5 px-4">FREQUENCY</th>
                <th className="py-2.5 px-4">DURATION</th>
                <th className="py-2.5 px-4">PRESCRIBER</th>
                <th className="py-2.5 px-4">STATUS</th>
                <th className="py-2.5 pl-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-powder-blue/15 dark:divide-charcoal/30">
              {prescriptions.map((rx) => {
                const patient = patients.find(p => p.id === rx.patientId);
                return (
                  <tr key={rx.id} className="hover:bg-alice-blue/30 dark:hover:bg-charcoal/20 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-bold text-onyx dark:text-alice-blue">
                        {patient ? patient.name : rx.patientId}
                      </div>
                      <div className="text-[10px] font-mono text-charcoal dark:text-lavender-grey">
                        {patient ? `${patient.uhid} (${patient.ward})` : rx.patientId}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-onyx dark:text-alice-blue">
                      <div className="flex items-center gap-2">
                        <span>{rx.medicine}</span>
                        {rx.isStat && <StatBadge showPulse={false} />}
                      </div>
                      {rx.instructions && (
                        <div className="text-[10px] font-normal text-charcoal dark:text-lavender-grey mt-0.5">
                          {rx.instructions}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-charcoal dark:text-lavender-grey">
                      {rx.dose} • {rx.route}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-onyx dark:text-alice-blue">
                      {rx.frequency}
                    </td>

                    <td className="py-3 px-4 font-mono text-charcoal dark:text-lavender-grey">
                      {rx.durationDays} days
                    </td>

                    <td className="py-3 px-4 text-charcoal dark:text-lavender-grey">
                      {rx.doctorName}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        rx.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-zinc-500/10 text-zinc-500'
                      }`}>
                        {rx.status}
                      </span>
                    </td>

                    <td className="py-3 pl-4 text-right">
                      {rx.status === 'ACTIVE' ? (
                        <button
                          onClick={() => {
                            setRxToStop(rx);
                            setStopModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                        >
                          STOP Rx
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-charcoal dark:text-lavender-grey">
                          Stopped: {rx.stoppedReason || 'Completed'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Prescription Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Electronic Clinical Prescription (e-Rx)"
        subtitle="Voice-assisted prescribing with real-time allergy cross-reactivity interception"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreatePrescription} className="space-y-4">
          
          {/* Clinical AI Voice Dictation Pill */}
          <div className="p-3 rounded-xl bg-alice-blue/50 dark:bg-[#141819] border border-powder-blue/30 dark:border-charcoal/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-powder-blue" />
              <div>
                <span className="text-xs font-bold text-onyx dark:text-alice-blue block">
                  Clinical AI Voice-to-Prescription Assistant
                </span>
                <span className="text-[10px] font-mono text-charcoal dark:text-lavender-grey">
                  Say: "Prescribe Meropenem 1 gram IV TDS for 7 days"
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? 'LISTENING...' : 'DICTATE'}</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Select Inpatient *
              </label>
              <select
                value={rxForm.patientId}
                onChange={(e) => setRxForm({ ...rxForm, patientId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.uhid} - {p.ward})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                value={rxForm.medicine}
                onChange={(e) => setRxForm({ ...rxForm, medicine: e.target.value })}
                placeholder="e.g. Meropenem Injection, Paracetamol"
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Dose (e.g. 1 g, 500 mg, 40 mg) *
              </label>
              <input
                type="text"
                required
                value={rxForm.dose}
                onChange={(e) => setRxForm({ ...rxForm, dose: e.target.value })}
                placeholder="e.g. 1000 mg"
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Route of Administration *
              </label>
              <select
                value={rxForm.route}
                onChange={(e) => setRxForm({ ...rxForm, route: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              >
                <option value="IV">IV (Intravenous)</option>
                <option value="Oral">Oral</option>
                <option value="SC">SC (Subcutaneous)</option>
                <option value="IM">IM (Intramuscular)</option>
                <option value="Inhalation">Inhalation</option>
                <option value="Topical">Topical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Frequency (Dosing Interval) *
              </label>
              <select
                value={rxForm.frequency}
                onChange={(e) => setRxForm({ ...rxForm, frequency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              >
                <option value="STAT">STAT (Immediate Once-Only Emergency)</option>
                <option value="OD">OD (Once Daily - 08:00)</option>
                <option value="BD">BD (Twice Daily - 08:00, 20:00)</option>
                <option value="TDS">TDS (Three Times Daily - 08:00, 14:00, 20:00)</option>
                <option value="QID">QID (Four Times Daily - 06:00, 12:00, 18:00, 22:00)</option>
                <option value="Q4H">Q4H (Every 4 Hours)</option>
                <option value="Q6H">Q6H (Every 6 Hours)</option>
                <option value="HS">HS (At Bedtime - 21:00)</option>
                <option value="PRN">PRN (As Needed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={rxForm.durationDays}
                onChange={(e) => setRxForm({ ...rxForm, durationDays: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
              Clinical Administration Instructions
            </label>
            <input
              type="text"
              value={rxForm.instructions}
              onChange={(e) => setRxForm({ ...rxForm, instructions: e.target.value })}
              placeholder="e.g. Infuse slowly over 30 mins with sterile saline."
              className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
            />
          </div>

          {/* Real-time Safety Warnings Interception Box */}
          {safetyWarnings.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>CLINICAL SAFETY WARNINGS INTERCEPTED ({safetyWarnings.length})</span>
              </div>
              {safetyWarnings.map((w, idx) => (
                <div key={idx} className="text-xs text-charcoal dark:text-lavender-grey pl-6">
                  <strong className="text-rose-600 dark:text-rose-400">{w.title}:</strong> {w.message}
                </div>
              ))}
            </div>
          )}

          {/* Schedule Preview Bar */}
          {schedulePreview.length > 0 && (
            <div className="p-3 rounded-xl bg-alice-blue/30 dark:bg-[#141819] border border-powder-blue/25 dark:border-charcoal/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal dark:text-lavender-grey block mb-1 font-bold">
                ■ AUTO-GENERATED DOSING PREVIEW ({schedulePreview.length} EVENTS WILL BE CREATED):
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-charcoal dark:text-lavender-grey">
                {schedulePreview.slice(0, 6).map((evt, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-[#1c2223] border border-powder-blue/30 dark:border-charcoal/60">
                    {new Date(evt.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({evt.route})
                  </span>
                ))}
                {schedulePreview.length > 6 && (
                  <span className="px-2 py-0.5 rounded bg-powder-blue/20 text-onyx dark:text-alice-blue">
                    +{schedulePreview.length - 6} more doses
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-powder-blue/20 dark:border-charcoal/40">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 text-xs font-bold text-charcoal dark:text-lavender-grey"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Authorize e-Prescription
            </button>
          </div>
        </form>
      </Modal>

      {/* Stop Prescription Modal */}
      {rxToStop && (
        <Modal
          isOpen={stopModalOpen}
          onClose={() => setStopModalOpen(false)}
          title="Discontinue Medication Order"
          subtitle={`Discontinuing ${rxToStop.medicine} for Patient ${rxToStop.patientId}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-charcoal dark:text-lavender-grey leading-relaxed">
              Discontinuing this prescription will automatically mark all remaining scheduled doses as <strong>NOT GIVEN</strong> and register a permanent audit record.
            </p>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Clinical Discontinuation Rationale *
              </label>
              <textarea
                rows={3}
                value={stopReason}
                onChange={(e) => setStopReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStopModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 text-xs font-bold text-charcoal dark:text-lavender-grey"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStopPrescription}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Stop
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Drug-Drug Interaction (DDI) Matrix Modal */}
      <Modal
        isOpen={ddiModalOpen}
        onClose={() => setDdiModalOpen(false)}
        title="Drug-Drug Interaction (DDI) Safety Cross-Grid"
        subtitle="Automated polypharmacy risk matrix mapped against hospital formulary"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-charcoal dark:text-lavender-grey leading-relaxed">
            The Med-Sathi DDI engine cross-checks all co-prescribed molecules to evaluate nephrotoxicity, bleeding risks, and QT prolongation.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-powder-blue/20 dark:border-charcoal/40 font-mono text-[11px] text-charcoal dark:text-lavender-grey">
                  <th className="py-2 pr-4">DRUG A</th>
                  <th className="py-2 px-4">DRUG B</th>
                  <th className="py-2 px-4">RISK LEVEL</th>
                  <th className="py-2 pl-4">CLINICAL RATIONALE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-powder-blue/15 dark:divide-charcoal/30">
                <tr className="hover:bg-alice-blue/30 dark:hover:bg-charcoal/20">
                  <td className="py-2.5 pr-4 font-bold text-onyx dark:text-alice-blue">Enoxaparin (LMWH)</td>
                  <td className="py-2.5 px-4 font-bold text-onyx dark:text-alice-blue">Aspirin / NSAIDs</td>
                  <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-600">HIGH RISK</span></td>
                  <td className="py-2.5 pl-4 text-charcoal dark:text-lavender-grey">Compounded anti-platelet and anticoagulant effect increasing major GI bleed risk.</td>
                </tr>
                <tr className="hover:bg-alice-blue/30 dark:hover:bg-charcoal/20">
                  <td className="py-2.5 pr-4 font-bold text-onyx dark:text-alice-blue">Furosemide</td>
                  <td className="py-2.5 px-4 font-bold text-onyx dark:text-alice-blue">Gentamicin / Meropenem</td>
                  <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600">MODERATE</span></td>
                  <td className="py-2.5 pl-4 text-charcoal dark:text-lavender-grey">Potential potentiation of ototoxicity and transient acute kidney injury.</td>
                </tr>
                <tr className="hover:bg-alice-blue/30 dark:hover:bg-charcoal/20">
                  <td className="py-2.5 pr-4 font-bold text-onyx dark:text-alice-blue">Atorvastatin</td>
                  <td className="py-2.5 px-4 font-bold text-onyx dark:text-alice-blue">Clarithromycin</td>
                  <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600">MODERATE</span></td>
                  <td className="py-2.5 pl-4 text-charcoal dark:text-lavender-grey">CYP3A4 inhibition elevates statin concentrations, risking rhabdomyolysis.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

    </div>
  );
}

