import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Zap, ShieldAlert, X, Heart, Activity, CheckCircle2, RotateCcw } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';

export function CodeBlueModal({ isOpen, onClose, patients = [], currentUser }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [cycleCount, setCycleCount] = useState(1);
  const [shocksDelivered, setShocksDelivered] = useState(0);
  const [selectedJoules, setSelectedJoules] = useState('150J');
  const [eventLog, setEventLog] = useState([]);

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0] || {
    name: 'ICU Inpatient',
    age: 58,
    weight: 70,
    bed: 'ICU-02',
    ward: 'ICU'
  };

  const patientWeight = activePatient.weight || 70;

  // 2-Minute CPR Countdown Timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      logEvent(`⚠️ 2-MINUTE CPR CYCLE #${cycleCount} COMPLETE: Check Rhythm & Prepare Epinephrine 1mg IV`);
      setSecondsRemaining(120);
      setCycleCount(c => c + 1);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, cycleCount]);

  const logEvent = async (action) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${action}`;
    setEventLog(prev => [entry, ...prev]);

    // Send to audit log if possible
    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CODE_BLUE_RESUSCITATION',
          patientId: activePatient.id,
          performedBy: currentUser?.name || 'ICU Resuscitation Team',
          details: `${action} (Cycle #${cycleCount})`
        })
      });
    } catch (e) {
      // Non-blocking
    }
  };

  const handleDeliverShock = () => {
    const nextShocks = shocksDelivered + 1;
    setShocksDelivered(nextShocks);
    logEvent(`⚡ SHOCK #${nextShocks} DELIVERED (${selectedJoules} Biphasic) - CPR Resumed`);
  };

  const handleGiveDrug = (drugName, dose) => {
    logEvent(`💉 ADMINISTERED: ${drugName} (${dose}) IV Push via Rapid Line`);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgentDue = secondsRemaining <= 15;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-[#121616] border-2 border-rose-600/80 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden text-alice-blue flex flex-col max-h-[90vh]">
        
        {/* Urgent Emergency Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-[#121616] p-4 sm:p-5 flex items-center justify-between border-b border-rose-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-pulse shadow-lg shadow-rose-600/50">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-white font-mono">CODE BLUE RESUSCITATION CONSOLE</h2>
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-ping">
                  CRITICAL
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Patient: <span className="font-bold text-white">{activePatient.name}</span> ({activePatient.ward} - Bed {activePatient.bed}) | Weight: <span className="font-bold text-white">{patientWeight} kg</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-300 hover:text-white p-2 rounded-xl hover:bg-rose-800/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Console Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main Top Dual Panel: CPR Cycle Metronome & Defibrillator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* CPR Cycle 2-Minute Countdown */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isUrgentDue ? 'bg-rose-950/80 border-rose-500 animate-pulse' : 'bg-[#181d1e] border-rose-900/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>2-Min CPR Cycle Timer</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-200">
                  CYCLE #{cycleCount}
                </span>
              </div>

              <div className="flex items-baseline justify-center gap-2 py-3">
                <div className={`text-5xl sm:text-6xl font-black font-mono tracking-tighter ${
                  isUrgentDue ? 'text-rose-400' : 'text-white'
                }`}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isTimerRunning ? 'PAUSE TIMER' : 'RESUME TIMER'}
                </button>
                <button
                  onClick={() => {
                    setSecondsRemaining(120);
                    logEvent(`CPR Timer manually reset to 2:00`);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {/* Biphasic Defibrillator Shock Panel */}
            <div className="p-5 rounded-2xl bg-[#181d1e] border border-powder-blue/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-powder-blue flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Biphasic Defibrillator Controller</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-powder-blue/20 text-powder-blue">
                  SHOCKS: {shocksDelivered}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 py-1">
                {['120J', '150J', '200J'].map((joules) => (
                  <button
                    key={joules}
                    onClick={() => setSelectedJoules(joules)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      selectedJoules === joules
                        ? 'bg-powder-blue text-onyx border-powder-blue font-black'
                        : 'bg-onyx text-lavender-grey border-charcoal hover:border-powder-blue'
                    }`}
                  >
                    {joules}
                  </button>
                ))}
              </div>

              <button
                onClick={handleDeliverShock}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black font-mono tracking-wider text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>DELIVER {selectedJoules} SHOCK NOW</span>
              </button>
            </div>

          </div>

          {/* ACLS Weight-Adjusted Emergency Drug Quick Push */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal dark:text-lavender-grey block">
              ■ ACLS WEIGHT-ADJUSTED EMERGENCY MEDICATIONS ({patientWeight} KG):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleGiveDrug('Adrenaline (Epinephrine)', '1 mg (1:10,000 IV Push)')}
                className="p-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-left transition-all group"
              >
                <div className="font-bold text-xs text-rose-300 group-hover:text-white">Adrenaline 1mg</div>
                <div className="text-[10px] font-mono text-rose-400/80">Every 3-5 mins IV</div>
              </button>

              <button
                onClick={() => handleGiveDrug('Amiodarone Infusion', '300 mg Rapid Bolus')}
                className="p-3 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 text-left transition-all group"
              >
                <div className="font-bold text-xs text-amber-300 group-hover:text-white">Amiodarone 300mg</div>
                <div className="text-[10px] font-mono text-amber-400/80">Post 3rd shock VF/VT</div>
              </button>

              <button
                onClick={() => handleGiveDrug('Atropine Sulfate', `${(0.04 * patientWeight).toFixed(1)} mg IV Push`)}
                className="p-3 rounded-xl bg-sky-950/60 hover:bg-sky-900 border border-sky-700/60 text-left transition-all group"
              >
                <div className="font-bold text-xs text-sky-300 group-hover:text-white">Atropine</div>
                <div className="text-[10px] font-mono text-sky-400/80">{(0.04 * patientWeight).toFixed(1)} mg (Bradycardia)</div>
              </button>

              <button
                onClick={() => handleGiveDrug('Sodium Bicarbonate 8.4%', `${patientWeight} mEq IV Push`)}
                className="p-3 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-700/60 text-left transition-all group"
              >
                <div className="font-bold text-xs text-purple-300 group-hover:text-white">Sodium Bicarb</div>
                <div className="text-[10px] font-mono text-purple-400/80">{patientWeight} mEq (Severe Acidosis)</div>
              </button>
            </div>
          </div>

          {/* Immutable Real-time Resuscitation Event Log */}
          <div className="p-4 rounded-2xl bg-[#141819] border border-charcoal/50 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal dark:text-lavender-grey font-bold block">
              ■ LIVE RESUSCITATION CHRONOLOGICAL EVENT LOG ({eventLog.length} EVENTS):
            </span>
            <div className="h-28 overflow-y-auto space-y-1 text-xs font-mono">
              {eventLog.length === 0 ? (
                <div className="text-charcoal dark:text-lavender-grey italic text-[11px]">
                  No events logged yet. Timer started. Emergency pushes and shocks will record here.
                </div>
              ) : (
                eventLog.map((log, i) => (
                  <div key={i} className="text-alice-blue text-[11px] leading-relaxed">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CodeBlueModal;
