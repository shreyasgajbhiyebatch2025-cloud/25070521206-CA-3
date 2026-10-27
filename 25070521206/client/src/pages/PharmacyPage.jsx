import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { FALLBACK_INVENTORY } from '../api/mockFallbackData';
import {
  Layers, Package, AlertTriangle, ArrowRight, Plus,
  Search, CheckCircle2, RefreshCw, Box, AlertCircle
} from 'lucide-react';

export function PharmacyPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('ORDERS'); // 'ORDERS' or 'INVENTORY'
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(FALLBACK_INVENTORY);
  const [loading, setLoading] = useState(false);

  // Restock Modal
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [addQty, setAddQty] = useState(50);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, invRes] = await Promise.all([
        apiClient.pharmacy.getOrders(),
        apiClient.pharmacy.getInventory()
      ]);
      setOrders(ordRes.data || []);
      setInventory(invRes.data || []);
    } catch (err) {
      showToast('Could not load pharmacy records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!selectedStockItem) return;

    try {
      const updatedQty = selectedStockItem.stockQty + Number(addQty);
      const res = await apiClient.pharmacy.updateStock(selectedStockItem.id, {
        stockQty: updatedQty
      });

      if (res.success) {
        showToast(`Restocked ${selectedStockItem.medicine}. New Quantity: ${updatedQty} ${selectedStockItem.unit}`, 'success', 'Inventory Updated');
        setRestockModalOpen(false);
        setSelectedStockItem(null);
        fetchData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const lowStockCount = inventory.filter(i => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-powder-blue/20 dark:border-charcoal/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/40">
              CENTRAL HOSPITAL PHARMACY
            </span>
            <span className="text-[11px] font-mono text-charcoal dark:text-lavender-grey">
              DISPENSING & STOCK LEVEL CONTROL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-onyx dark:text-alice-blue tracking-tight uppercase">
            Inpatient Medication Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey mt-0.5">
            Automated prescription demand requirements, central stock levels & reorder alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lowStockCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockCount} REORDER ALERTS</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-powder-blue/20 dark:border-charcoal/40 pb-1">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-4 py-2 rounded-t-xl text-xs font-mono font-bold tracking-wider transition-all border-b-2 ${
            activeTab === 'ORDERS'
              ? 'border-onyx dark:border-powder-blue text-onyx dark:text-alice-blue bg-powder-blue/10'
              : 'border-transparent text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue'
          }`}
        >
          ■ ACTIVE WARD REQUIREMENTS ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`px-4 py-2 rounded-t-xl text-xs font-mono font-bold tracking-wider transition-all border-b-2 ${
            activeTab === 'INVENTORY'
              ? 'border-onyx dark:border-powder-blue text-onyx dark:text-alice-blue bg-powder-blue/10'
              : 'border-transparent text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue'
          }`}
        >
          ■ PHARMACY STOCK INVENTORY ({inventory.length})
        </button>
      </div>

      {/* Tab Content: Ward Dispensing Orders */}
      {activeTab === 'ORDERS' ? (
        <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-powder-blue/20 dark:border-charcoal/40 font-mono text-[11px] text-charcoal dark:text-lavender-grey">
                  <th className="py-2.5 pr-4">INPATIENT & WARD</th>
                  <th className="py-2.5 px-4">PRESCRIBED DRUG</th>
                  <th className="py-2.5 px-4">DOSE & ROUTE</th>
                  <th className="py-2.5 px-4">FREQUENCY</th>
                  <th className="py-2.5 px-4">DISPENSING PROGRESS</th>
                  <th className="py-2.5 pl-4">ORDER TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-powder-blue/15 dark:divide-charcoal/30">
                {orders.map((ord) => {
                  const percent = ord.totalDoses > 0 ? Math.round((ord.dispensedDoses / ord.totalDoses) * 100) : 0;
                  return (
                    <tr key={ord.prescriptionId} className="hover:bg-alice-blue/30 dark:hover:bg-charcoal/20 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-bold text-onyx dark:text-alice-blue">
                          {ord.patientName}
                        </div>
                        <div className="text-[10px] font-mono text-charcoal dark:text-lavender-grey">
                          {ord.ward} • Bed {ord.bed}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-onyx dark:text-alice-blue">
                        {ord.medicine}
                      </td>

                      <td className="py-3 px-4 font-mono text-charcoal dark:text-lavender-grey">
                        {ord.dose} • {ord.route}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-onyx dark:text-alice-blue">
                        {ord.frequency}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-powder-blue/30 dark:bg-charcoal/60 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-charcoal dark:text-lavender-grey">
                            {ord.dispensedDoses}/{ord.totalDoses} doses
                          </span>
                        </div>
                      </td>

                      <td className="py-3 pl-4 font-mono text-[11px] text-charcoal dark:text-lavender-grey">
                        {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab Content: Pharmacy Stock Inventory */
        <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-powder-blue/20 dark:border-charcoal/40 font-mono text-[11px] text-charcoal dark:text-lavender-grey">
                  <th className="py-2.5 pr-4">MEDICINE ITEM</th>
                  <th className="py-2.5 px-4">CATEGORY</th>
                  <th className="py-2.5 px-4">LOCATION BAY</th>
                  <th className="py-2.5 px-4">STOCK QUANTITY</th>
                  <th className="py-2.5 px-4">REORDER THRESHOLD</th>
                  <th className="py-2.5 px-4">STATUS</th>
                  <th className="py-2.5 pl-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-powder-blue/15 dark:divide-charcoal/30">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-alice-blue/30 dark:hover:bg-charcoal/20 transition-colors">
                    <td className="py-3 pr-4 font-bold text-onyx dark:text-alice-blue">
                      {item.medicine}
                    </td>

                    <td className="py-3 px-4 font-mono text-charcoal dark:text-lavender-grey">
                      {item.category}
                    </td>

                    <td className="py-3 px-4 font-mono text-charcoal dark:text-lavender-grey">
                      {item.location}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-onyx dark:text-alice-blue">
                      {item.stockQty} {item.unit}
                    </td>

                    <td className="py-3 px-4 font-mono text-charcoal dark:text-lavender-grey">
                      {item.reorderLevel} {item.unit}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status === 'LOW_STOCK'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : item.status === 'OUT_OF_STOCK'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedStockItem(item);
                          setRestockModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-powder-blue/20 hover:bg-powder-blue/40 text-onyx dark:text-alice-blue border border-powder-blue/30 transition-colors"
                      >
                        + RESTOCK
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {selectedStockItem && (
        <Modal
          isOpen={restockModalOpen}
          onClose={() => setRestockModalOpen(false)}
          title="Restock Pharmacy Inventory"
          subtitle={`Adjust quantity for ${selectedStockItem.medicine}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRestock} className="space-y-4">
            <div className="p-3 rounded-xl bg-alice-blue/40 dark:bg-[#141819] text-xs font-mono space-y-1">
              <div>Current Stock: <strong>{selectedStockItem.stockQty} {selectedStockItem.unit}</strong></div>
              <div>Location: <strong>{selectedStockItem.location}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-onyx dark:text-alice-blue mb-1">
                Quantity to Add ({selectedStockItem.unit}) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs text-onyx dark:text-alice-blue focus:outline-none focus:ring-2 focus:ring-powder-blue"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestockModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 text-xs font-bold text-charcoal dark:text-lavender-grey"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide hover:opacity-90"
              >
                Confirm Restock
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}

