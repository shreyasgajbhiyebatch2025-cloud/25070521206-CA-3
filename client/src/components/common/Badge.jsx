import React from 'react';
import { AlertCircle, Clock, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

export function StatusBadge({ status }) {
  const norm = (status || '').toUpperCase();

  const configs = {
    DUE: {
      label: 'DUE NOW',
      bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/30',
      dot: 'bg-sky-500 animate-pulse',
    },
    UPCOMING: {
      label: 'UPCOMING',
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30',
      dot: 'bg-slate-400',
    },
    OVERDUE: {
      label: 'OVERDUE',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      dot: 'bg-rose-500 animate-ping',
    },
    GIVEN: {
      label: 'GIVEN ON TIME',
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    DELAYED: {
      label: 'DELAYED',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500',
    },
    HELD: {
      label: 'HELD CLINICALLY',
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      dot: 'bg-purple-500',
    },
    REFUSED: {
      label: 'REFUSED',
      bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
      dot: 'bg-orange-500',
    },
    NOT_GIVEN: {
      label: 'DISCONTINUED',
      bg: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/30',
      dot: 'bg-zinc-400',
    },
  };

  const config = configs[norm] || configs.UPCOMING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}

export function StatBadge({ showPulse = true }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-widest bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40">
      <Zap className={`w-3 h-3 ${showPulse ? 'animate-bounce' : ''}`} />
      <span>STAT EMERGENCY</span>
    </span>
  );
}

export function AllergyBadge({ allergy }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      <span>{allergy}</span>
    </span>
  );
}

export function RiskBadge({ level = 'LOW', score }) {
  const norm = (level || '').toUpperCase();
  const isHigh = norm === 'HIGH';
  const isMed = norm === 'MODERATE' || norm === 'MEDIUM';

  const color = isHigh
    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
    : isMed
    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${color}`}>
      <span>{norm} RISK</span>
      {score !== undefined && <span className="opacity-75">({score}%)</span>}
    </span>
  );
}
