import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { apiClient } from '../../api/axiosClient';
import { Sparkles, AlertTriangle, ShieldCheck, Activity, Layers, Clock, Info } from 'lucide-react';

export function AiDelayRiskModal({ isOpen, onClose }) {
  const [ward, setWard] = useState('General Ward');
  const [medicineName, setMedicineName] = useState('Paracetamol');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = () => {
    setLoading(true);
    apiClient.aiRisk.predict({ ward, medicineName })
      .then(res => setPrediction(res))
      .catch(err => console.error('Error fetching AI risk:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchPrediction();
    }
  }, [isOpen, ward, medicineName]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Medication Delay Risk Telemetry" maxWidth="max-w-xl">
      <div className="space-y-5">
        
        {/* Prototype Clinical Disclaimer Box */}
        <div className="p-3.5 bg-powder-blue/15 border border-powder-blue/30 rounded-xl text-onyx dark:text-alice-blue flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-powder-blue flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-extrabold block mb-0.5 font-mono uppercase">
              Decision-Support Prototype (Research Telemetry)
            </span>
            <p className="text-charcoal dark:text-lavender-grey leading-snug">
              This system uses historical ward scheduling telemetry and transparent heuristic rules to identify potential medication round bottlenecks. It does not make medical or clinical decisions.
            </p>
          </div>
        </div>

        {/* Ward & Medication Selector */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-onyx dark:text-alice-blue mb-1">
              Select Ward
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full px-3 py-2 bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 rounded-xl text-xs font-semibold text-onyx dark:text-alice-blue focus:outline-none focus:ring-1 focus:ring-powder-blue"
            >
              <option value="General Ward">General Ward</option>
              <option value="ICU">Intensive Care Unit (ICU)</option>
              <option value="Surgical Ward">Surgical Ward</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatric Ward">Pediatric Ward</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-onyx dark:text-alice-blue mb-1">
              Medication Profile
            </label>
            <select
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="w-full px-3 py-2 bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 rounded-xl text-xs font-semibold text-onyx dark:text-alice-blue focus:outline-none focus:ring-1 focus:ring-powder-blue"
            >
              <option value="Paracetamol">Paracetamol (Oral Standard)</option>
              <option value="Meropenem">Meropenem (IV Infusion)</option>
              <option value="Noradrenaline">Noradrenaline (IV Titrated)</option>
              <option value="Pantoprazole">Pantoprazole (Oral)</option>
              <option value="Furosemide">Furosemide (IV Diuretic)</option>
            </select>
          </div>
        </div>

        {/* Prediction Results */}
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-charcoal dark:text-lavender-grey">
            Computing heuristic risk parameters...
          </div>
        ) : prediction?.data ? (
          <div className="space-y-4">
            
            <div className="p-4 rounded-xl aspen-card bg-white dark:bg-[#181d1e] flex items-center justify-between border border-powder-blue/30">
              <div>
                <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey block font-bold">
                  PROJECTED BOTTLENECK PROBABILITY
                </span>
                <div className="text-2xl font-black text-onyx dark:text-alice-blue mt-0.5">
                  {prediction.data.riskScore}% Probability of Round Delay
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                prediction.data.riskLevel === 'HIGH'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  : prediction.data.riskLevel === 'MEDIUM'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              }`}>
                {prediction.data.riskLevel} DELAY RISK
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold font-mono text-charcoal dark:text-lavender-grey uppercase block">
                ■ CONTRIBUTING CLINICAL FACTORS:
              </span>
              <div className="space-y-1.5 text-xs text-charcoal dark:text-lavender-grey">
                {prediction.data.factors?.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-alice-blue/30 dark:bg-[#141819] border border-powder-blue/20">
                    <span className="text-powder-blue font-mono font-bold">[{i + 1}]</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-alice-blue/40 dark:bg-[#141819] border border-powder-blue/30 text-xs">
              <span className="font-bold text-onyx dark:text-alice-blue block mb-1">Operational Recommendation:</span>
              <p className="text-charcoal dark:text-lavender-grey leading-relaxed">
                {prediction.data.recommendation}
              </p>
            </div>

          </div>
        ) : null}

      </div>
    </Modal>
  );
}
