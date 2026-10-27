import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Pill } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="aspen-card p-8 sm:p-12 max-w-md w-full bg-white dark:bg-[#181d1e] border border-powder-blue/40 dark:border-charcoal/60 space-y-4">
        
        <div className="w-12 h-12 rounded-2xl bg-powder-blue/20 text-onyx dark:text-alice-blue flex items-center justify-center mx-auto font-black text-xl">
          404
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-onyx dark:text-alice-blue tracking-tight uppercase">
          Resource Not Found
        </h1>

        <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey leading-relaxed">
          The requested clinical ward or page does not exist or has been relocated within the hospital eMAR network.
        </p>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

