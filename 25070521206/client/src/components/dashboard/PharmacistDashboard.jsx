import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, Package, AlertTriangle, ArrowRight, CheckCircle2,
  Box, RefreshCw, Thermometer, ShieldAlert, Check, Plus
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid
} from 'recharts';

export function PharmacistDashboard({ inventory = [], onRestock }) {
  const [dispensedOrders, setDispensedOrders] = useState({
    'ORD-01': false,
    'ORD-02': false,
    'ORD-03': true,
    'ORD-04': true
  });

  const toggleDispense = (ordId) => {
    setDispensedOrders(prev => ({ ...prev, [ordId]: !prev[ordId] }));
  };

  const lowStockItems = inventory.filter(item => item.status === 'LOW_STOCK' || item.stockQty <= item.reorderLevel);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Pharmacist Station Alert Banner */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider">
              ■ CENTRAL INPATIENT PHARMACY — AUTOMATED DISPENSING HUB
            </div>
            <p className="text-xs text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
              <span className="font-bold text-[#121616] dark:text-[#dcedff]">{lowStockItems.length} essential medications</span> are below minimum reorder thresholds. Cold-chain storage temperature within safe range.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/pharmacy"
            className="px-3.5 py-1.5 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] text-xs font-bold font-mono tracking-wider transition-colors flex items-center gap-1.5"
          >
            <span>INVENTORY BAY →</span>
          </Link>
        </div>
      </div>

      {/* Pharmacist 4 Distinct KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-[#94b0da]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              01 / TOTAL STOCK ITEMS
            </span>
            <Box className="w-4 h-4 text-[#94b0da]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121616] dark:text-[#dcedff]">
            {inventory.length}
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Active Formulary Inpatient Drugs
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              02 / LOW STOCK REORDER ALERTS
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {lowStockItems.length}
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Paracetamol, Noradrenaline, Linezolid
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-cyan-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              03 / COLD CHAIN TELEMETRY
            </span>
            <Thermometer className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
            3.6 °C
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Refrigerators A & B (Safe Range: 2-8°C)
          </span>
        </div>

        <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
              04 / UNITS DISPENSED TODAY
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            184
          </div>
          <span className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] block mt-1">
            Vials, Ampoules & Infusion Bottles
          </span>
        </div>

      </div>

      {/* Main Pharmacist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Prescription Verification & Low Stock Reorder */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Prescription Dispense Verification Queue */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ INPATIENT DISPENSING ORDERS
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  Doctor Orders Awaiting Pharmacy Verification
                </h3>
              </div>
              <Link
                to="/pharmacy"
                className="text-xs font-mono font-bold text-[#94b0da] hover:underline flex items-center gap-1"
              >
                <span>VIEW ALL ORDERS</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { id: 'ORD-01', medicine: 'Meropenem Injection 1g', patient: 'Rajesh Verma (ICU-03)', dose: '1 g IV TDS', doctor: 'Dr. Rajesh Sharma', qty: '6 Vials', isStat: false },
                { id: 'ORD-02', medicine: 'Furosemide Injection 20mg/2mL', patient: 'Rajesh Verma (ICU-03)', dose: '40 mg IV STAT', doctor: 'Dr. Rajesh Sharma', qty: '2 Ampoules', isStat: true },
                { id: 'ORD-03', medicine: 'Paracetamol IV 100mL (1000mg)', patient: 'Sunita Sharma (SW-07)', dose: '1000 mg IV Q6H', doctor: 'Dr. Rajesh Sharma', qty: '4 Bottles', isStat: false },
                { id: 'ORD-04', medicine: 'Enoxaparin Sodium 60mg/0.6mL', patient: 'Ananya Sen (CARD-02)', dose: '60 mg SC BD', doctor: 'Dr. Rajesh Sharma', qty: '2 Syringes', isStat: false },
              ].map((ord) => {
                const isCleared = dispensedOrders[ord.id];

                return (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-xl border border-[#94b0da]/30 dark:border-[#505a5b]/40 bg-[#dcedff]/20 dark:bg-[#141819] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {ord.isStat && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-600 text-white animate-pulse">
                            STAT
                          </span>
                        )}
                        <span className="font-bold text-sm text-[#121616] dark:text-[#dcedff]">
                          {ord.medicine}
                        </span>
                        <span className="text-xs font-mono text-[#8f91a2]">({ord.qty})</span>
                      </div>
                      <div className="text-xs text-[#505a5b] dark:text-[#8f91a2]">
                        <span className="font-semibold text-[#121616] dark:text-[#dcedff]">{ord.patient}</span> • Prescribed by {ord.doctor}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleDispense(ord.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                          isCleared
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90'
                        }`}
                      >
                        {isCleared ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>VERIFIED & DISPENSED</span>
                          </>
                        ) : (
                          <span>VERIFY & DISPENSE</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pharmacy Critical Low Stock Bay */}
          <div className="aspen-card p-6 bg-white dark:bg-[#181d1e]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
                  ■ INVENTORY THRESHOLD WATCHLIST
                </span>
                <h3 className="text-base font-bold text-[#121616] dark:text-[#dcedff] uppercase tracking-tight">
                  Medications Below Reorder Point
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                AUTO-REORDER PROMPT
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#94b0da]/20 dark:border-[#505a5b]/40 text-[#505a5b] dark:text-[#8f91a2] font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Medicine</th>
                    <th className="pb-3 font-bold">Bay Location</th>
                    <th className="pb-3 font-bold">Stock</th>
                    <th className="pb-3 font-bold">Reorder Level</th>
                    <th className="pb-3 font-bold text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94b0da]/10 dark:divide-[#505a5b]/30">
                  {lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#dcedff]/20 dark:hover:bg-[#141819]/50">
                      <td className="py-3 font-bold text-[#121616] dark:text-[#dcedff]">
                        {item.medicine}
                      </td>
                      <td className="py-3 font-mono text-[#505a5b] dark:text-[#8f91a2]">
                        {item.location}
                      </td>
                      <td className="py-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {item.stockQty} {item.unit}
                      </td>
                      <td className="py-3 font-mono text-[#505a5b] dark:text-[#8f91a2]">
                        {item.reorderLevel} {item.unit}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onRestock && onRestock(item.id, item.stockQty + 50)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] hover:opacity-90 inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>RESTOCK +50</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Crash Cart & Cold Chain Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Cold-Chain Refrigerator Telemetry Card */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold">
                ■ BIOLOGICALS COLD-CHAIN SENSORS
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center justify-between font-bold text-[#121616] dark:text-[#dcedff]">
                  <span>Refrigerator A (Insulins & Vaccines)</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">3.4 °C</span>
                </div>
                <div className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
                  Safe Range: 2.0°C to 8.0°C • Sensor calibration verified 06:00
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center justify-between font-bold text-[#121616] dark:text-[#dcedff]">
                  <span>Refrigerator B (Enoxaparin / Heparin)</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">4.1 °C</span>
                </div>
                <div className="text-[10px] text-[#505a5b] dark:text-[#8f91a2] mt-0.5">
                  Safe Range: 2.0°C to 8.0°C • Auto-defrost cycle normal
                </div>
              </div>
            </div>
          </div>

          {/* Crash Cart Resuscitation Replenishment */}
          <div className="aspen-card p-5 bg-white dark:bg-[#181d1e] space-y-3 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2] font-bold block">
              ■ ACLS EMERGENCY CRASH CART STOCK
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#dcedff]/20 dark:bg-[#141819]">
                <div>
                  <div className="font-bold text-[#121616] dark:text-[#dcedff]">Amiodarone 150mg/3mL</div>
                  <div className="text-[10px] text-[#8f91a2]">Crash Cart Bay 1</div>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">28 Ampoules</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#dcedff]/20 dark:bg-[#141819]">
                <div>
                  <div className="font-bold text-[#121616] dark:text-[#dcedff]">Atropine Sulfate 0.6mg/mL</div>
                  <div className="text-[10px] text-[#8f91a2]">Crash Cart Bay 1</div>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">45 Ampoules</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#dcedff]/20 dark:bg-[#141819]">
                <div>
                  <div className="font-bold text-[#121616] dark:text-[#dcedff]">Noradrenaline 4mg/2mL</div>
                  <div className="text-[10px] text-[#8f91a2]">Emergency Vasopressor</div>
                </div>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">18 Ampoules (Low)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

