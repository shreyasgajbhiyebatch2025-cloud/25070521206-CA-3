import React from 'react';

export function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 7);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-onyx dark:text-alice-blue">
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal dark:text-lavender-grey">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          className={`w-full rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs sm:text-sm font-medium text-onyx dark:text-alice-blue placeholder:text-charcoal/50 dark:placeholder:text-lavender-grey/40 py-2.5 ${
            Icon ? 'pl-9' : 'pl-3.5'
          } pr-3.5 focus:outline-none focus:ring-2 focus:ring-powder-blue/60 focus:border-powder-blue transition-all ${
            error ? 'border-rose-500 focus:ring-rose-500' : ''
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[11px] font-semibold text-rose-500 mt-1">{error}</p>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  options = [],
  className = '',
  id,
  ...props
}) {
  const selectId = id || props.name || Math.random().toString(36).substring(2, 7);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-onyx dark:text-alice-blue">
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={`w-full rounded-xl bg-alice-blue/30 dark:bg-[#1a1f20] border border-powder-blue/40 dark:border-charcoal/60 text-xs sm:text-sm font-medium text-onyx dark:text-alice-blue py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-powder-blue/60 focus:border-powder-blue transition-all ${
          error ? 'border-rose-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#181d1e] text-onyx dark:text-alice-blue">
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-[11px] font-semibold text-rose-500 mt-1">{error}</p>
      )}
    </div>
  );
}

