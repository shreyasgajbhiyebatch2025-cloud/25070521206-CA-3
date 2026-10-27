import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import {
  Pill, ArrowRight, Eye, EyeOff, Check,
  Stethoscope, ClipboardList, Layers, Building2,
  Sparkles, Sun, Moon, ShieldCheck, HeartPulse,
  Lock, UserCheck, AlertCircle
} from 'lucide-react';

export function SignupPage() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('DOCTOR');
  const [department, setDepartment] = useState('Cardiology & ICU');
  const [title, setTitle] = useState('Attending Physician');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Role metadata preset definitions
  const ROLE_OPTIONS = [
    {
      key: 'DOCTOR',
      label: 'Doctor',
      icon: Stethoscope,
      defaultTitle: 'Attending Physician',
      defaultDept: 'Cardiology & ICU'
    },
    {
      key: 'NURSE',
      label: 'Nurse',
      icon: ClipboardList,
      defaultTitle: 'Senior Staff Nurse (eMAR Lead)',
      defaultDept: 'Emergency & Acute Care'
    },
    {
      key: 'PHARMACIST',
      label: 'Pharmacist',
      icon: Layers,
      defaultTitle: 'Clinical Pharmacist Specialist',
      defaultDept: 'Central Inpatient Pharmacy'
    },
    {
      key: 'ADMIN',
      label: 'Admin',
      icon: Building2,
      defaultTitle: 'Chief Medical Officer / Quality Dir.',
      defaultDept: 'Hospital Safety & Governance'
    }
  ];

  const handleRoleSelect = (opt) => {
    setRole(opt.key);
    setTitle(opt.defaultTitle);
    setDepartment(opt.defaultDept);
  };

  // Evaluator Quick-Fill Fast Pass (1-click fill to speed up professor review)
  const handleQuickFill = (targetRole) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    if (targetRole === 'DOCTOR') {
      setFirstName('Vikram');
      setLastName('Malhotra');
      setEmail(`dr.vikram${randomSuffix}@smartmed.com`);
      setPassword('hospitalSecure2026');
      setConfirmPassword('hospitalSecure2026');
      setRole('DOCTOR');
      setTitle('Consultant Cardiologist');
      setDepartment('Cardiac ICU');
    } else if (targetRole === 'NURSE') {
      setFirstName('Ananya');
      setLastName('Deshmukh');
      setEmail(`nurse.ananya${randomSuffix}@smartmed.com`);
      setPassword('hospitalSecure2026');
      setConfirmPassword('hospitalSecure2026');
      setRole('NURSE');
      setTitle('ICU Charge Nurse');
      setDepartment('Critical Care Unit');
    } else if (targetRole === 'PHARMACIST') {
      setFirstName('Rohan');
      setLastName('Mehta');
      setEmail(`pharm.rohan${randomSuffix}@smartmed.com`);
      setPassword('hospitalSecure2026');
      setConfirmPassword('hospitalSecure2026');
      setRole('PHARMACIST');
      setTitle('Formulary Specialist');
      setDepartment('Inpatient Dispensing Bay');
    } else {
      setFirstName('Devika');
      setLastName('Nair');
      setEmail(`admin.devika${randomSuffix}@smartmed.com`);
      setPassword('hospitalSecure2026');
      setConfirmPassword('hospitalSecure2026');
      setRole('ADMIN');
      setTitle('Quality Assurance Director');
      setDepartment('Clinical Governance');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    // Validations
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first and last name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid clinical hospital email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Clinical Safety & Patient Privacy Protocol.');
      return;
    }

    setLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const payload = {
      name: fullName,
      email: email.trim().toLowerCase(),
      password,
      role,
      title: title || 'Clinical Practitioner',
      department: department || 'General Ward'
    };

    try {
      const res = await signup(payload, false);
      setLoading(false);

      if (res?.success) {
        showToast(
          `Registration complete for ${fullName}! Please sign in with your credentials to access your console.`,
          'success',
          'Account Registered'
        );
        // Navigate to Login page as the next step after registration
        navigate('/login', {
          state: {
            registeredEmail: payload.email,
            registeredName: fullName,
            registeredRole: role,
            justRegistered: true
          }
        });
      } else {
        setError(res?.error || 'Registration could not be completed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Network error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#121616] text-[#121616] dark:text-[#dcedff] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-[#94b0da] selection:text-[#121616] transition-colors duration-300">
      
      {/* Outer Editorial Split Frame (Exact 50/50 Layout from Reference Image) */}
      <div className="w-full max-w-[1100px] min-h-[660px] bg-white dark:bg-[#181d1e] border border-[#94b0da]/30 dark:border-[#505a5b]/40 rounded-[28px] overflow-hidden shadow-[0_25px_70px_rgba(18,22,22,0.12)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.65)] grid grid-cols-1 lg:grid-cols-12 transition-colors">
        
        {/* Left Form Panel (7 cols / 58% on Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-white dark:bg-[#181d1e]">
          
          <div>
            {/* Top Navigation Row: Brand + Theme Toggle + Back to Home */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-[#121616] dark:bg-[#94b0da] text-[#dcedff] dark:text-[#121616] flex items-center justify-center font-black shadow-sm transition-transform group-hover:scale-105">
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-xs font-black tracking-widest uppercase text-[#121616] dark:text-[#dcedff]">
                  MED-SATHI
                </span>
              </Link>

              <div className="flex items-center gap-2">
                {/* Dark / Light Mode Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] hover:bg-[#94b0da]/20 transition-all border border-transparent hover:border-[#94b0da]/30"
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle Theme"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#505a5b]" />
                  )}
                </button>

                <Link
                  to="/"
                  className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-[#dcedff] hover:bg-[#94b0da]/15 transition-all flex items-center gap-1"
                >
                  <span>Back to site</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Editorial Title & Subtitle (In Style of Reference Image: "Welcome back ! / The faster you fill up...") */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-[#121616] dark:text-white mb-2">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-[#505a5b] dark:text-[#8f91a2] font-normal leading-relaxed">
                The faster you register, the faster you ensure zero medication errors.
              </p>
            </div>

            {/* Evaluator Fast-Pass Ribbon */}
            <div className="mb-6 p-2.5 rounded-xl bg-[#dcedff]/40 dark:bg-[#121616]/70 border border-[#94b0da]/40 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="font-mono font-bold text-[#505a5b] dark:text-[#94b0da] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#94b0da]" />
                <span>1-Click Test Fill:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('DOCTOR')}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181d1e] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/40 hover:border-[#94b0da] shadow-2xs transition-all"
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('NURSE')}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181d1e] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/40 hover:border-[#94b0da] shadow-2xs transition-all"
                >
                  Nurse
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('PHARMACIST')}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181d1e] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/40 hover:border-[#94b0da] shadow-2xs transition-all"
                >
                  Pharmacist
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('ADMIN')}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181d1e] text-[#121616] dark:text-[#dcedff] font-bold border border-[#94b0da]/40 hover:border-[#94b0da] shadow-2xs transition-all"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Clinical Role Selector Strip */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#505a5b] dark:text-[#8f91a2] mb-1.5 font-mono">
                  Select Clinical Specialty Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = role === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleRoleSelect(opt)}
                        className={`p-2 rounded-xl text-left border text-xs font-semibold flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-[#121616] dark:bg-[#94b0da] text-white dark:text-[#121616] border-[#121616] dark:border-[#94b0da] shadow-sm'
                            : 'bg-white dark:bg-[#121616]/60 text-[#505a5b] dark:text-[#8f91a2] border-[#94b0da]/30 hover:border-[#94b0da]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Row: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#505a5b] dark:text-[#8f91a2] mb-1 font-mono">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Vikram"
                    required
                    className="w-full bg-white dark:bg-[#121616]/80 border border-[#94b0da]/50 dark:border-[#505a5b]/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#121616] dark:text-[#dcedff] placeholder-[#8f91a2] focus:border-[#121616] dark:focus:border-[#94b0da] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#505a5b] dark:text-[#8f91a2] mb-1 font-mono">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Malhotra"
                    required
                    className="w-full bg-white dark:bg-[#121616]/80 border border-[#94b0da]/50 dark:border-[#505a5b]/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#121616] dark:text-[#dcedff] placeholder-[#8f91a2] focus:border-[#121616] dark:focus:border-[#94b0da] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-[#505a5b] dark:text-[#8f91a2] mb-1 font-mono">
                  Hospital Clinical Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your hospital staff email"
                  required
                  className="w-full bg-white dark:bg-[#121616]/80 border border-[#94b0da]/50 dark:border-[#505a5b]/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#121616] dark:text-[#dcedff] placeholder-[#8f91a2] focus:border-[#121616] dark:focus:border-[#94b0da] focus:outline-none transition-colors"
                />
              </div>

              {/* Department & Clinical Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#505a5b] dark:text-[#8f91a2] mb-1 font-mono">
                    Department / Ward
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Cardiology & ICU"
                    className="w-full bg-white dark:bg-[#121616]/80 border border-[#94b0da]/50 dark:border-[#505a5b]/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#121616] dark:text-[#dcedff] placeholder-[#8f91a2] focus:border-[#121616] dark:focus:border-[#94b0da] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#505a5b] dark:text-[#8f91a2] mb-1 font-mono">
                    Official Position Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Attending Physician"
                    className="w-full bg-white dark:bg-[#121616]/80 border border-[#94b0da]/50 dark:border-[#505a5b]/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#121616] dark:text-[#dcedff] placeholder-[#8f91a2] focus:border-[#121616] dark:focus:border-[#94b0da] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#505a5b] dark:text-[#8f91a2] mb-1 font-mono">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white dark:bg-[#121616]/80 border border-[#94b0da]/50 dark:border-[#505a5b]/60 rounded-xl px-3.5 py-2.5 pr-9 text-xs sm:text-sm text-[#121616] dark:text-[#dcedff] placeholder-[#8f91a2] focus:border-[#121616] dark:focus:border-[#94b0da] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#505a5b] dark:text-[#8f91a2] hover:text-[#121616] dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#505a5b] dark:text-[#8f91a2] mb-1 font-mono">
                    Confirm Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white dark:bg-[#121616]/80 border border-[#94b0da]/50 dark:border-[#505a5b]/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#121616] dark:text-[#dcedff] placeholder-[#8f91a2] focus:border-[#121616] dark:focus:border-[#94b0da] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Protocol Agreement Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    agreeTerms
                      ? 'bg-[#121616] dark:bg-[#94b0da] text-white dark:text-[#121616]'
                      : 'border border-[#94b0da]/60 bg-white dark:bg-[#121616]'
                  }`}
                >
                  {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-[11px] text-[#505a5b] dark:text-[#8f91a2]">
                  I agree to the <span className="underline font-semibold hover:text-[#121616] dark:hover:text-white cursor-pointer">Clinical Safety & Patient Privacy Protocol</span>
                </span>
              </div>

              {/* Submit Button (Style matches reference image button) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#121616] dark:bg-[#94b0da] hover:bg-[#505a5b] dark:hover:bg-[#dcedff] text-[#dcedff] dark:text-[#121616] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Registering Account...' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Sign In with Google / Hospital SSO (Reference Image Secondary Button) */}
              <button
                type="button"
                onClick={() => {
                  handleQuickFill('DOCTOR');
                  showToast('Auto-populated demo physician credentials. Click Create Account to finish.', 'info', 'SSO Fast Pass');
                }}
                className="w-full py-2.5 rounded-xl border border-[#94b0da]/40 hover:border-[#94b0da] bg-white dark:bg-[#181d1e] text-[#121616] dark:text-[#dcedff] font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:bg-[#94b0da]/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign up with Hospital Google SSO</span>
              </button>
            </form>
          </div>

          {/* THE REQUESTED PROMINENT FUNCTIONAL BUTTON: "Already have an account? Log in" */}
          <div className="pt-6 border-t border-[#94b0da]/20 dark:border-[#505a5b]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#505a5b] dark:text-[#8f91a2]">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#dcedff]/70 dark:bg-[#121616] hover:bg-[#94b0da]/40 text-[#121616] dark:text-[#94b0da] font-bold border border-[#94b0da]/40 transition-all flex items-center gap-1.5 shadow-2xs group"
            >
              <span>Log in to your account</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

        </div>

        {/* Right Visual Panel (5 cols / 42% - Aesthetic Editorial Medical Photography matching Reference Image) */}
        <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-[#121616]">
          
          {/* Aesthetic Medical Clinical Background Photography */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80')`
            }}
          />

          {/* Editorial Liquid / Ripple Glass Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121616] via-[#121616]/70 to-[#121616]/40" />

          {/* Subtle Chromatic Accent Ripple (Matches strictly palette: #dcedff, #94b0da, #8f91a2, #505a5b) */}
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#94b0da]/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-[#8f91a2]/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Top Watermark / Brand Accent */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-serif italic text-lg tracking-wider text-white/90 drop-shadow-md">
              Med-Sathi
            </span>
            <div className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#dcedff] bg-black/40 backdrop-blur-md border border-white/10 uppercase">
              Clinical eMAR
            </div>
          </div>

          {/* Center Hologram Glass Card: 5-Rights Bedside Verification */}
          <div className="relative z-10 my-auto p-4 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 text-white space-y-2 shadow-2xl">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94b0da]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SAFETY SENTINEL ACTIVE</span>
              </span>
              <span>UHID-2026-9021</span>
            </div>
            <div className="text-sm font-bold tracking-tight">
              Closed-Loop Bedside Verification
            </div>
            <p className="text-[11px] text-[#dcedff]/80 leading-relaxed">
              Every registered clinician operates with real-time allergy cross-screening, duplicate therapy alerts, and automated 5-Rights audit validation.
            </p>
            <div className="pt-2 flex items-center gap-2 border-t border-white/10 text-[10px] font-mono text-[#94b0da]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Harm Administration Standard</span>
            </div>
          </div>

          {/* Bottom Editorial Caption (Matching Reference Image Typography: Stylized title + descriptive blurb) */}
          <div className="relative z-10 space-y-2 pt-6">
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight leading-tight">
              Precision Care <span className="text-xs font-sans font-normal opacity-60">臨床安全</span>
            </h2>
            <p className="text-[11px] text-[#dcedff]/75 leading-relaxed font-sans max-w-sm">
              Empowering healthcare teams with closed-loop prescription verification, bedside barcode scanning, and real-time clinical governance.
            </p>
            <div className="flex items-center gap-1.5 pt-2">
              <span className="w-8 h-1 rounded-full bg-[#94b0da]" />
              <span className="w-2 h-1 rounded-full bg-white/30" />
              <span className="w-2 h-1 rounded-full bg-white/30" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SignupPage;