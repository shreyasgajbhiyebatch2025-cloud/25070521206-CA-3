import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun, Moon, ShieldAlert, Sparkles, LogOut, User,
  Menu, X, Search, Activity, Pill, Stethoscope, ClipboardList,
  Layers, Lock, Database
} from 'lucide-react';

export function Navbar({ onOpenAiModal, onOpenCodeBlue }) {
  const { currentUser, logout, switchRole, DEFAULT_USERS } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Live Clock in Aspen Search style (e.g., "10:04 AM LOCAL")
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Patients', path: '/patients' },
    { name: 'Prescriptions', path: '/prescriptions' },
    { name: 'Medications', path: '/medications' },
    { name: 'Pharmacy', path: '/pharmacy' },
    { name: 'Audit', path: '/audit' },
  ];

  return (
    <nav className="sticky top-0 z-40 glass-nav transition-all border-b border-[#94b0da]/20 dark:border-[#505a5b]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand & Aspen Live Clock */}
          <div className="flex items-center gap-5">
            <Link to={currentUser ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] flex items-center justify-center font-black tracking-wider shadow-sm transition-transform group-hover:scale-105">
                <Pill className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-black tracking-widest uppercase text-[#121616] dark:text-[#dcedff]">
                  MED-SATHI
                </span>
                <span className="text-[9px] font-mono tracking-wider text-[#505a5b] dark:text-[#8f91a2]">
                  CLINICAL INTELLIGENCE
                </span>
              </div>
            </Link>

            {/* Aspen Live Clock Monospace Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#94b0da]/30 dark:border-[#505a5b]/50 bg-[#dcedff]/30 dark:bg-[#121616]/40 text-[10px] font-mono text-[#505a5b] dark:text-[#8f91a2]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{timeStr || '10:04 AM'}</span>
            </div>
          </div>

          {/* Center Navigation Links (Protected) */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#94b0da]/25 dark:bg-[#505a5b]/50 text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/40 dark:border-[#8f91a2]/30'
                        : 'text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] hover:bg-[#dcedff]/50 dark:hover:bg-[#505a5b]/20'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* TEACHER FAST ROLE SWITCHER BUTTONS (ALWAYS VISIBLE IN NAVBAR FOR EASY EVALUATION) */}
            {currentUser && (
              <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#dcedff]/40 dark:bg-[#141819] border border-[#94b0da]/30 dark:border-[#505a5b]/50 text-[10px] font-mono">
                <span className="px-1 text-[#8f91a2] font-bold">ROLE:</span>
                {['DOCTOR', 'NURSE', 'ADMIN', 'PHARMACIST'].map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                      currentUser.role === r
                        ? 'bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616]'
                        : 'text-[#505a5b] dark:text-[#8f91a2] hover:bg-[#94b0da]/20'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {currentUser && (
              <>
                {/* Emergency Code Blue Button */}
                <button
                  onClick={onOpenCodeBlue}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all"
                  title="ACLS Resuscitation Emergency Console"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CODE BLUE</span>
                </button>

                {/* AI Copilot Quick Trigger */}
                <button
                  onClick={onOpenAiModal}
                  className="p-2 rounded-lg text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] hover:bg-[#dcedff]/60 dark:hover:bg-[#505a5b]/30 border border-transparent hover:border-[#94b0da]/30 transition-all"
                  title="AI Delay Risk Predictor"
                >
                  <Sparkles className="w-4 h-4 text-[#94b0da]" />
                </button>
              </>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] hover:bg-[#dcedff]/60 dark:hover:bg-[#505a5b]/30 border border-transparent hover:border-[#94b0da]/30 transition-all"
              title="Toggle Theme"
              aria-label="Toggle Dark and Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#505a5b]" />}
            </button>

            {/* User Profile & Demo Switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-[#94b0da]/30 dark:border-[#505a5b]/60 bg-[#dcedff]/40 dark:bg-[#1a1f20] hover:border-[#94b0da] transition-all"
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-[#94b0da]/40"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[11px] font-bold text-[#121616] dark:text-[#dcedff] leading-tight truncate max-w-[90px]">
                      {currentUser?.name || 'User'}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-[#505a5b] dark:text-[#8f91a2]">
                      {currentUser?.role || 'DOCTOR'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {roleMenuOpen && (
                  <div
                    onMouseLeave={() => setRoleMenuOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-xl aspen-card p-2 shadow-2xl z-50 animate-fade-in bg-white dark:bg-[#1a1f20] border border-[#94b0da]/40 dark:border-[#505a5b]/60"
                  >
                    <div className="px-3 py-2 border-b border-[#94b0da]/20 dark:border-[#505a5b]/40">
                      <p className="text-xs font-bold text-[#121616] dark:text-[#dcedff]">{currentUser?.name}</p>
                      <p className="text-[10px] font-mono text-[#505a5b] dark:text-[#8f91a2]">{currentUser?.email}</p>
                    </div>

                    <div className="py-1">
                      <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#505a5b] dark:text-[#8f91a2]">
                        Instant Persona Switch
                      </div>
                      {['DOCTOR', 'NURSE', 'ADMIN', 'PHARMACIST'].map((roleKey) => (
                        <button
                          key={roleKey}
                          onClick={() => {
                            switchRole(roleKey);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                            currentUser?.role === roleKey
                              ? 'bg-[#94b0da]/20 dark:bg-[#505a5b]/50 text-[#121616] dark:text-[#dcedff] font-bold'
                              : 'text-[#505a5b] dark:text-[#8f91a2] hover:bg-[#dcedff]/50 dark:hover:bg-[#505a5b]/30'
                          }`}
                        >
                          <span>{roleKey}</span>
                          <span className="text-[10px] font-mono">
                            {roleKey === 'DOCTOR' ? 'Dr. Sharma' : roleKey === 'NURSE' ? 'Nurse Priya' : roleKey === 'ADMIN' ? 'Dr. Gupta' : 'Anil Verma'}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
                      <Link
                        to="/profile"
                        onClick={() => setRoleMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] hover:bg-[#dcedff]/50 dark:hover:bg-[#505a5b]/30 rounded-lg transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile & Settings</span>
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#121616] dark:bg-[#dcedff] text-[#dcedff] dark:text-[#121616] hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white/95 dark:bg-[#181d1e]/95 border-b border-[#94b0da]/30 dark:border-[#505a5b]/40 animate-fade-in">
          {currentUser && (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#505a5b] dark:text-[#8f91a2] hover:bg-[#dcedff]/60 dark:hover:bg-[#505a5b]/30"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#94b0da]/20 dark:border-[#505a5b]/40">
                <div className="px-3 py-1 text-[10px] font-mono text-[#8f91a2]">SWITCH EVALUATOR ROLE:</div>
                <div className="grid grid-cols-2 gap-1 px-3">
                  {['DOCTOR', 'NURSE', 'ADMIN', 'PHARMACIST'].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setMobileMenuOpen(false);
                      }}
                      className="px-2 py-1 text-[10px] rounded bg-[#dcedff]/50 dark:bg-[#1c2223] font-bold text-left"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
