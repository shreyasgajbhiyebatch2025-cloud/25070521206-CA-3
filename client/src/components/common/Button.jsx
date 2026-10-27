import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  icon: Icon,
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-onyx hover:bg-charcoal text-alice-blue dark:bg-powder-blue dark:hover:bg-alice-blue dark:text-onyx shadow-sm focus:ring-powder-blue',
    secondary: 'bg-alice-blue hover:bg-powder-blue/40 text-onyx dark:bg-charcoal dark:hover:bg-charcoal/80 dark:text-alice-blue border border-powder-blue/30 dark:border-charcoal/60 focus:ring-powder-blue',
    outline: 'bg-transparent border border-powder-blue/50 dark:border-charcoal hover:bg-alice-blue/40 dark:hover:bg-charcoal/30 text-onyx dark:text-alice-blue focus:ring-powder-blue',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-alice-blue/50 dark:hover:bg-charcoal/30 text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue focus:ring-powder-blue',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
    </button>
  );
}

