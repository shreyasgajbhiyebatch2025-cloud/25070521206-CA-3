import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/axiosClient';
import { Search, Command, User, Pill, AlertTriangle, ArrowRight, X, Clock, ShieldAlert } from 'lucide-react';

export function AspenHeroSearch({ onSelectPatient, activeWard, onSelectWard, placeholder = "Search inpatient name, UHID, drug, ward (e.g. ICU, Paracetamol, UHID-9021)..." }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ patients: [], medications: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut listener: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search debounced fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults({ patients: [], medications: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [patRes, medRes] = await Promise.all([
          apiClient.patients.getAll({ search: query }),
          apiClient.medications.getSchedules({ search: query })
        ]);
        setResults({
          patients: (patRes.data || []).slice(0, 5),
          medications: (medRes.data || []).slice(0, 4)
        });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const wards = ['ALL', 'ICU', 'Surgical Ward', 'Cardiology', 'General Ward', 'Pediatric Ward'];

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto my-4 z-30">
      
      {/* Aspen Search Hero Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-charcoal dark:text-lavender-grey group-focus-within:text-onyx dark:group-focus-within:text-powder-blue transition-colors">
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-12 sm:pl-14 pr-24 sm:pr-28 py-3.5 sm:py-4 rounded-2xl bg-white/90 dark:bg-[#1a1f20]/90 border border-powder-blue/40 dark:border-charcoal/60 text-sm sm:text-base font-medium text-onyx dark:text-alice-blue placeholder:text-charcoal/60 dark:placeholder:text-lavender-grey/50 shadow-search backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-powder-blue/60 focus:border-powder-blue transition-all"
        />

        {/* Clear Button & Keyboard Shortcut Indicator */}
        <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center gap-2">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults({ patients: [], medications: [] });
              }}
              className="p-1 rounded-lg text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-alice-blue/70 dark:bg-charcoal/40 border border-powder-blue/30 dark:border-charcoal text-[11px] font-mono text-charcoal dark:text-lavender-grey">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Ward Quick Filter Pills */}
      {onSelectWard && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="font-mono text-[10px] uppercase text-charcoal dark:text-lavender-grey pl-1 flex-shrink-0">
            ■ FAST FILTER:
          </span>
          {wards.map((ward) => (
            <button
              key={ward}
              onClick={() => onSelectWard(ward)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
                activeWard === ward
                  ? 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold shadow-sm'
                  : 'bg-white/80 dark:bg-[#1a1f20]/80 text-charcoal dark:text-lavender-grey border border-powder-blue/30 dark:border-charcoal/50 hover:border-powder-blue'
              }`}
            >
              {ward === 'ALL' ? 'All Departments' : ward}
            </button>
          ))}
        </div>
      )}

      {/* Live Dropdown Results Modal */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl aspen-card p-3 shadow-2xl z-50 bg-white dark:bg-[#181d1e] border border-powder-blue/40 dark:border-charcoal/70 animate-fade-in max-h-[480px] overflow-y-auto">
          
          {loading && (
            <div className="p-4 text-center text-xs font-mono text-charcoal dark:text-lavender-grey">
              Searching clinical registries...
            </div>
          )}

          {!loading && results.patients.length === 0 && results.medications.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-xs font-semibold text-charcoal dark:text-lavender-grey">
                No matching inpatients or prescriptions found for "{query}".
              </p>
              <span className="text-[11px] font-mono text-charcoal/70 dark:text-lavender-grey/70 block mt-1">
                Try searching by Ward (ICU), UHID, or Drug Name (Meropenem)
              </span>
            </div>
          )}

          {/* Patient Matches */}
          {!loading && results.patients.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-charcoal dark:text-lavender-grey border-b border-powder-blue/20 dark:border-charcoal/40">
                ■ MATCHED INPATIENTS ({results.patients.length})
              </div>
              <div className="mt-1 space-y-1">
                {results.patients.map((pat) => (
                  <div
                    key={pat.id}
                    onClick={() => {
                      setIsOpen(false);
                      if (onSelectPatient) {
                        onSelectPatient(pat.id);
                      } else {
                        navigate(`/patients?selected=${pat.id}`);
                      }
                    }}
                    className="p-2.5 rounded-xl flex items-center justify-between hover:bg-alice-blue/60 dark:hover:bg-charcoal/30 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-powder-blue/20 dark:bg-charcoal/50 text-onyx dark:text-alice-blue flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-onyx dark:text-alice-blue group-hover:text-powder-blue transition-colors">
                            {pat.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-alice-blue/80 dark:bg-charcoal text-charcoal dark:text-alice-blue">
                            {pat.uhid}
                          </span>
                          {pat.hasPendingStat && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400">
                              STAT PENDING
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-charcoal dark:text-lavender-grey">
                          {pat.ward} • Bed {pat.bed} • {pat.diagnosis}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal dark:text-lavender-grey opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medication Schedule Matches */}
          {!loading && results.medications.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-charcoal dark:text-lavender-grey border-b border-powder-blue/20 dark:border-charcoal/40">
                ■ MATCHED MEDICATION TASKS ({results.medications.length})
              </div>
              <div className="mt-1 space-y-1">
                {results.medications.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/medications');
                    }}
                    className="p-2.5 rounded-xl flex items-center justify-between hover:bg-alice-blue/60 dark:hover:bg-charcoal/30 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-powder-blue/20 dark:bg-charcoal/50 text-onyx dark:text-alice-blue flex items-center justify-center">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-onyx dark:text-alice-blue group-hover:text-powder-blue transition-colors">
                            {med.medicine} ({med.dose})
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {med.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal dark:text-lavender-grey">
                          Patient: {med.patientName} ({med.patientWard}, Bed {med.patientBed}) • Route: {med.route}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal dark:text-lavender-grey opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

