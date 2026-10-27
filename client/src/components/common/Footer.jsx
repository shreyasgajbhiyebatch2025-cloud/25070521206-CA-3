import React from 'react';
import { Pill, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-powder-blue/25 dark:border-charcoal/40 bg-white/50 dark:bg-[#121616]/70 backdrop-blur-md py-8 text-charcoal dark:text-lavender-grey transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx flex items-center justify-center font-bold">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold tracking-widest text-onyx dark:text-alice-blue uppercase">
                MED-SATHI
              </span>
              <p className="text-[11px] text-charcoal dark:text-lavender-grey">
                Next-Gen Closed-Loop Clinical Drug Chart & Patient Safety System
              </p>
            </div>
          </div>

          {/* Aspen Monospace Status Indicators */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-alice-blue/60 dark:bg-charcoal/30 border border-powder-blue/30 dark:border-charcoal text-onyx dark:text-alice-blue">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>NABH & JCI READY</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-alice-blue/60 dark:bg-charcoal/30 border border-powder-blue/30 dark:border-charcoal text-onyx dark:text-alice-blue">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>CLOSED-LOOP eMAR ONLINE</span>
            </span>

            <span className="text-charcoal/80 dark:text-lavender-grey/70">
              © {new Date().getFullYear()} Med-Sathi
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

