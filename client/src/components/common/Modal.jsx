import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-onyx/70 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white dark:bg-[#181d1e] border border-powder-blue/40 dark:border-charcoal/60 shadow-2xl overflow-hidden z-10 animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-powder-blue/20 dark:border-charcoal/40 bg-alice-blue/20 dark:bg-[#15191a]">
          <div>
            {title && (
              <h2 className="text-base sm:text-lg font-bold text-onyx dark:text-alice-blue tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-charcoal dark:text-lavender-grey mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue hover:bg-alice-blue/50 dark:hover:bg-charcoal/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
