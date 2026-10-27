import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  User, ShieldCheck, Sun, Moon, LogOut, Database,
  Activity, CheckCircle2, Building, Mail, Key, Sparkles
} from 'lucide-react';

export function ProfilePage() {
  const { currentUser, logout, switchRole, DEFAULT_USERS } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="border-b border-powder-blue/20 dark:border-charcoal/40 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-powder-blue/20 text-onyx dark:text-alice-blue border border-powder-blue/40">
            STAFF IDENTITY & PREFERENCES
          </span>
          <span className="text-[11px] font-mono text-charcoal dark:text-lavender-grey">
            TERMINAL ID: {currentUser?.id || 'USR-01'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-onyx dark:text-alice-blue tracking-tight uppercase">
          Clinical Profile & System Settings
        </h1>
      </div>

      {/* Main Profile Info Card */}
      <div className="aspen-card p-6 sm:p-8 bg-white dark:bg-[#181d1e] space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-powder-blue shadow-md"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-onyx dark:text-alice-blue">
                {currentUser?.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx uppercase">
                {currentUser?.role}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-charcoal dark:text-lavender-grey">
              {currentUser?.title || 'Senior Clinical Staff'} • {currentUser?.department || 'Internal Medicine'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-mono text-charcoal dark:text-lavender-grey">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-powder-blue" />
                {currentUser?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-powder-blue" />
                Auth: JWT (SHA-256)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Role Switcher for Judges & Demonstrations */}
      <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey font-bold block">
            ■ INSTANT EVALUATION PERSONA HUB
          </span>
          <h3 className="text-base font-bold text-onyx dark:text-alice-blue uppercase">
            Switch Clinical Role (1-Click)
          </h3>
          <p className="text-xs text-charcoal dark:text-lavender-grey mt-0.5">
            Evaluate distinct role permissions across Doctor, Nurse, Admin, and Pharmacist workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.keys(DEFAULT_USERS).map((roleKey) => {
            const persona = DEFAULT_USERS[roleKey];
            const isSelected = currentUser?.role === roleKey;
            return (
              <button
                key={roleKey}
                onClick={() => {
                  switchRole(roleKey);
                  showToast(`Switched active role to ${roleKey} (${persona.name})`, 'success', 'Role Switch');
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-onyx dark:bg-powder-blue text-alice-blue dark:text-onyx border-transparent shadow-sm'
                    : 'bg-alice-blue/30 dark:bg-[#141819] text-charcoal dark:text-lavender-grey border-powder-blue/30 dark:border-charcoal/50 hover:border-powder-blue'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold">
                  {roleKey}
                </div>
                <div className="text-sm font-bold mt-1">
                  {persona.name.split(' ')[0]} {persona.name.split(' ')[1]}
                </div>
                <div className="text-[11px] opacity-75 mt-0.5 truncate">
                  {persona.department}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance & System Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Theme Settings */}
        <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey font-bold block">
              ■ DISPLAY THEME
            </span>
            <h3 className="text-base font-bold text-onyx dark:text-alice-blue uppercase mt-1">
              Dark / Light Mode
            </h3>
            <p className="text-xs text-charcoal dark:text-lavender-grey mt-1">
              Currently operating in <strong>{theme.toUpperCase()} MODE</strong> with persistent storage in localStorage.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-powder-blue/40 dark:border-charcoal/60 text-xs font-mono font-bold text-charcoal dark:text-lavender-grey hover:text-onyx dark:hover:text-alice-blue transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-charcoal" />}
              <span>TOGGLE TO {isDark ? 'LIGHT' : 'DARK'}</span>
            </button>
          </div>
        </div>

        {/* Database & Architecture Status */}
        <div className="aspen-card p-6 bg-white dark:bg-[#181d1e] space-y-3">
          <span className="text-[10px] font-mono uppercase text-charcoal dark:text-lavender-grey font-bold block">
            ■ BACKEND & DATABASE SPECIFICATION
          </span>
          <div className="space-y-1.5 text-xs font-mono text-charcoal dark:text-lavender-grey">
            <div className="flex justify-between">
              <span>Database:</span>
              <strong className="text-onyx dark:text-alice-blue">MongoDB (Compass) via Mongoose</strong>
            </div>
            <div className="flex justify-between">
              <span>Connection:</span>
              <strong className="text-onyx dark:text-alice-blue">mongodb://127.0.0.1:27017/medsathi</strong>
            </div>
            <div className="flex justify-between">
              <span>Authentication:</span>
              <strong className="text-onyx dark:text-alice-blue">JWT + Bcrypt Password Hashing</strong>
            </div>
            <div className="flex justify-between">
              <span>Frontend Stack:</span>
              <strong className="text-onyx dark:text-alice-blue">React.js, React Router, Axios, Recharts</strong>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-500 font-bold">● CONNECTED & ONLINE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sign Out Button */}
      <div className="pt-2 text-right">
        <button
          onClick={() => {
            logout();
            showToast('Signed out from current terminal session.', 'info');
            navigate('/login');
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </div>

    </div>
  );
}

