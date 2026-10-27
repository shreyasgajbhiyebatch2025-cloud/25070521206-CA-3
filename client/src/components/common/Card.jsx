import React from 'react';

export function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`aspen-card p-5 sm:p-6 bg-white dark:bg-[#181d1e] border border-powder-blue/30 dark:border-charcoal/50 ${
        hover ? 'hover:-translate-y-0.5 hover:shadow-aspen-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-powder-blue/20 dark:border-charcoal/40 ${className}`}>
      <div>
        {title && <h3 className="text-base sm:text-lg font-bold text-onyx dark:text-alice-blue tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs text-charcoal dark:text-lavender-grey mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

