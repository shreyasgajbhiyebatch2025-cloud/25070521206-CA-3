import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AllergyBadge, StatusBadge, StatBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { AspenHeroSearch } from '../components/common/AspenHeroSearch';
import { FALLBACK_PATIENTS } from '../api/mockFallbackData';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users, Plus, Search, Filter, QrCode, ArrowLeft, Stethoscope,
  Clock, ShieldAlert, Heart, Activity, AlertTriangle, FileText, CheckCircle2
} from 'lucide-react';

export function PatientsPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [patients, setPatients] = useState(FALLBACK_PATIENTS);
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedPatientId, setSelectedPatientId] = useState(searchParams.get('selected') || null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modals
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [qrModalPatient, setQrModalPatient] = useState(null);

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    weight: '',
    ward: 'General Ward',
    bed: 'GW-01',
    diagnosis: '',
    allergies: '',
  });

  const fetchPatients = async () => {
    try {
      const res = await apiClient.patients.getAll({ ward: selectedWard });
      if (res?.data && res.data.length > 0) {
        setPatients(res.data);
      }
    } catch (err) {
      console.warn('Patients fetch notice:', err.message);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [selectedWard]);

  // Load single patient details when selected
  useEffect(() => {
    const id = searchParams.get('selected') || selectedPatientId;
    if (id) {
      setSelectedPatientId(id);
      setDetailLoading(true);
      apiClient.patients.getById(id)
        .then(res => setPatientDetail(res.data))
        .catch(() => showToast('Failed to load patient profile', 'error'))
        .finally(() => setDetailLoading(false));
    } else {
      setPatientDetail(null);
    }
  }, [selectedPatientId, searchParams]);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      const allergiesArr = newPatient.allergies
        ? newPatient.allergies.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const res = await apiClient.patients.create({
        ...newPatient,
        allergies: allergiesArr,
        medicalHistory: ['Admitted via Med-Sathi eMAR Gateway']
      });

      if (res.success) {
        showToast(`Patient ${newPatient.name} registered successfully with ${res.data.uhid}`, 'success', 'Admission Confirmed');
        setRegisterModalOpen(false);
        setNewPatient({
          name: '',
          age: '',
          gender: 'Male',
          weight: '',
          ward: 'General Ward',
          bed: 'GW-01',
          diagnosis: '',
          allergies: '',
        });
        fetchPatients();
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
              INPATIENT REGISTRY & EMR
            </span>
            <span className="text-[11px] font-mono text-charcoal dark:text-lavender-grey">
              5-RIGHTS RFID & QR BARCODE ENABLED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-onyx dark:text-alice-blue tracking-tight uppercase">
            Clinical Patient Directory
          </h1>
          <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey mt-0.5">
            Active ward beds, diagnostic summaries, hypersensitivity profiles & live e-orders
          </p>
        </div>

        <button
          onClick={() => setRegisterModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide shadow-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Register Inpatient</span>
        </button>
      </div>

      {/* Prominent Aspen Hero Search with Ward Filter */}
      {!selectedPatientId && (
        <AspenHeroSearch
          activeWard={selectedWard}
          onSelectWard={setSelectedWard}
          onSelectPatient={(id) => setSelectedPatientId(id)}
        />
      )}

      {/* Main View: Patient Profile Drilldown OR Directory Grid */}
      {selectedPatientId && patientDetail ? (
        <div className="space-y-6 animate-fade-in">
          
          <button
            onClick={() => {
              setSelectedPatientId(null);
              setSearchParams({});
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-powder-blue/40 dark:border-charcoal/60 text-xs font-mono font-bold text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue hover:bg-alice-blue/40 dark:hover:bg-charcoal/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← BACK TO PATIENT DIRECTORY</span>
          </button>

          {/* Patient Hero Info Card */}
          <div className="aspen-card p-6 sm:p-8 bg-white dark:bg-[#181d1e]">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx">
                    {patientDetail.patient.uhid}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/40">
                    {patientDetail.patient.ward} • Bed {patientDetail.patient.bed}
                  </span>
                  {patientDetail.patient.allergies?.map((allg, idx) => (
                    <AllergyBadge key={idx} allergy={allg} />
                  ))}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-onyx dark:text-alice-blue tracking-tight">
                  {patientDetail.patient.name}
                </h2>

                <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey max-w-2xl leading-relaxed">
                  <span className="font-bold text-onyx dark:text-alice-blue">Diagnosis:</span> {patientDetail.patient.diagnosis}
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-charcoal dark:text-lavender-grey">
                  <span>Age: <strong className="text-onyx dark:text-alice-blue">{patientDetail.patient.age} yrs</strong></span>
                  <span>Gender: <strong className="text-onyx dark:text-alice-blue">{patientDetail.patient.gender}</strong></span>
                  <span>Weight: <strong className="text-onyx dark:text-alice-blue">{patientDetail.patient.weight} kg</strong></span>
                  <span>Blood Pressure: <strong className="text-onyx dark:text-alice-blue">{patientDetail.patient.vitals?.bp}</strong></span>
                  <span>Heart Rate: <strong className="text-onyx dark:text-alice-blue">{patientDetail.patient.vitals?.hr} bpm</strong></span>
                  <span>SpO2: <strong className="text-onyx dark:text-alice-blue">{patientDetail.patient.vitals?.spo2}%</strong></span>
                </div>
              </div>

              {/* Bedside Barcode QR Trigger */}
              <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0">
                <button
                  onClick={() => setQrModalPatient(patientDetail.patient)}
                  className="p-4 rounded-2xl border border-powder-blue/40 dark:border-charcoal/60 bg-alice-blue/30 dark:bg-[#141819] hover:border-powder-blue transition-all flex flex-col items-center gap-2 group"
                >
                  <QRCodeSVG value={patientDetail.patient.qrCode} size={90} className="rounded-lg shadow-sm" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-charcoal dark:text-lavender-grey group-hover:text-onyx dark:group-hover:text-alice-blue">
                    VIEW BEDSIDE WRISTBAND QR
                  </span>
                </button>
              </div>

            </div>
          </div>

          {/* Active Prescriptions Table */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-4">
            <div className="flex items-center justify-between border-b border-powder-blue/20 dark:border-charcoal/40 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey font-bold block">
                  ■ VERIFIED ELECTRONIC ORDERS
                </span>
                <h3 className="text-base font-bold text-onyx dark:text-alice-blue uppercase">
                  Active Prescriptions ({patientDetail.prescriptions?.length || 0})
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-powder-blue/20 dark:border-charcoal/40 font-mono text-[11px] text-charcoal dark:text-lavender-grey">
                    <th className="py-2.5 pr-4">MEDICATION</th>
                    <th className="py-2.5 px-4">DOSE & ROUTE</th>
                    <th className="py-2.5 px-4">FREQUENCY</th>
                    <th className="py-2.5 px-4">PRESCRIBER</th>
                    <th className="py-2.5 px-4">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-powder-blue/15 dark:divide-charcoal/30">
                  {patientDetail.prescriptions?.map((rx) => (
                    <tr key={rx.id} className="hover:bg-alice-blue/30 dark:hover:bg-charcoal/20 transition-colors">
                      <td className="py-3 pr-4 font-bold text-onyx dark:text-alice-blue">
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
                        {rx.frequency} ({rx.durationDays} days)
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medication Administration Timeline */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-4">
            <div className="flex items-center justify-between border-b border-powder-blue/20 dark:border-charcoal/40 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey font-bold block">
                  ■ CLOSED-LOOP ADMINISTRATION TRAIL
                </span>
                <h3 className="text-base font-bold text-onyx dark:text-alice-blue uppercase">
                  Dose Timeline & Events ({patientDetail.medicationTimeline?.length || 0})
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {patientDetail.medicationTimeline?.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-powder-blue/25 dark:border-charcoal/40 bg-white dark:bg-[#161a1b] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-powder-blue/20 text-onyx dark:text-alice-blue flex items-center justify-center font-mono font-bold text-xs">
                      <Clock className="w-4 h-4 text-powder-blue" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-onyx dark:text-alice-blue">
                          {item.medicine} ({item.dose}, {item.route})
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-[11px] font-mono text-charcoal dark:text-lavender-grey mt-0.5">
                        Scheduled: {new Date(item.scheduledTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        {item.administeredBy && ` • Administered by: ${item.administeredBy}`}
                      </p>
                    </div>
                  </div>

                  {item.reason && (
                    <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                      Reason: {item.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Patient Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((pat) => (
            <div
              key={pat.id}
              className="aspen-card p-5 bg-white dark:bg-[#181d1e] flex flex-col justify-between group cursor-pointer hover:border-powder-blue"
              onClick={() => {
                setSelectedPatientId(pat.id);
                setSearchParams({ selected: pat.id });
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/40">
                    {pat.uhid}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-alice-blue/60 dark:bg-charcoal/40 text-charcoal dark:text-lavender-grey">
                    {pat.ward} • {pat.bed}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-onyx dark:text-alice-blue group-hover:text-powder-blue transition-colors">
                    {pat.name}
                  </h3>
                  {pat.hasPendingStat && <StatBadge showPulse={false} />}
                </div>

                <p className="text-xs text-charcoal dark:text-lavender-grey line-clamp-2 mt-1 leading-relaxed">
                  {pat.diagnosis}
                </p>

                {pat.allergies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {pat.allergies.map((allg, idx) => (
                      <AllergyBadge key={idx} allergy={allg} />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-powder-blue/20 dark:border-charcoal/40 flex items-center justify-between text-xs font-mono text-charcoal dark:text-lavender-grey">
                <span>{pat.activePrescriptionsCount || 0} active e-orders</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQrModalPatient(pat);
                  }}
                  className="p-1 rounded text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue"
                  title="View Bedside QR"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Patient Modal */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Register Inpatient Admission"
        subtitle="Generate electronic medical record and encrypted bedside wristband QR"
      >
        <form onSubmit={handleRegisterPatient} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                required
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                placeholder="e.g. 52"
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Gender *
              </label>
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Weight in kg (for ACLS & Dosing) *
              </label>
              <input
                type="number"
                required
                value={newPatient.weight}
                onChange={(e) => setNewPatient({ ...newPatient, weight: e.target.value })}
                placeholder="e.g. 70"
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Assigned Ward *
              </label>
              <select
                value={newPatient.ward}
                onChange={(e) => setNewPatient({ ...newPatient, ward: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              >
                <option value="General Ward">General Ward</option>
                <option value="ICU">ICU</option>
                <option value="Surgical Ward">Surgical Ward</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatric Ward">Pediatric Ward</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Bed Number *
              </label>
              <input
                type="text"
                required
                value={newPatient.bed}
                onChange={(e) => setNewPatient({ ...newPatient, bed: e.target.value })}
                placeholder="e.g. GW-05"
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
              Primary Diagnosis *
            </label>
            <input
              type="text"
              required
              value={newPatient.diagnosis}
              onChange={(e) => setNewPatient({ ...newPatient, diagnosis: e.target.value })}
              placeholder="e.g. Severe Community-Acquired Pneumonia with Septicemia"
              className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
              Documented Drug Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={newPatient.allergies}
              onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
              placeholder="e.g. Penicillin, NSAID, Sulfa"
              className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
            />
            <p className="text-[10px] font-mono text-charcoal dark:text-lavender-grey mt-1">
              Cross-reactive alerts will automatically trigger if prescribing related classes.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-powder-blue/20 dark:border-charcoal/40">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 text-xs font-bold text-charcoal dark:text-lavender-grey"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Confirm Admission
            </button>
          </div>
        </form>
      </Modal>

      {/* Bedside Wristband QR Modal */}
      {qrModalPatient && (
        <Modal
          isOpen={Boolean(qrModalPatient)}
          onClose={() => setQrModalPatient(null)}
          title="Bedside 5-Rights RFID & QR Barcode"
          subtitle={`Encrypted identity wristband for ${qrModalPatient.name}`}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center p-4 text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-powder-blue/60 shadow-lg">
              <QRCodeSVG value={qrModalPatient.qrCode} size={220} />
            </div>

            <div className="space-y-1 font-mono">
              <div className="text-base font-black text-onyx dark:text-alice-blue">
                {qrModalPatient.name}
              </div>
              <div className="text-xs text-charcoal dark:text-lavender-grey">
                UHID: {qrModalPatient.uhid} • Ward: {qrModalPatient.ward} ({qrModalPatient.bed})
              </div>
              <div className="text-[10px] text-charcoal dark:text-lavender-grey break-all max-w-xs pt-1">
                {qrModalPatient.qrCode}
              </div>
            </div>

            <p className="text-xs text-charcoal dark:text-lavender-grey leading-relaxed">
              Scan this QR code during nurse medication rounds to execute closed-loop bedside 5-Rights verification.
            </p>
          </div>
        </Modal>
      )}

    </div>
  );
}

