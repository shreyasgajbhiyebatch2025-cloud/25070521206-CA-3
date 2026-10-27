import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Pill, ArrowRight, Eye, EyeOff, Check,
  Stethoscope, ClipboardList, Layers, Building2,
  CheckCircle2, AlertCircle
} from 'lucide-react';

export function LoginPage() {
  const { login, signup, switchRole, DEFAULT_USERS } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Pick up credentials from registration flow if redirected
  const incomingEmail = location.state?.registeredEmail || '';
  const incomingName = location.state?.registeredName || '';
  const incomingRole = location.state?.registeredRole || '';
  const justRegistered = location.state?.justRegistered || false;

  // Mode: 'signin' or 'signup'
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState('Rajesh');
  const [lastName, setLastName] = useState('Sharma');
  const [email, setEmail] = useState(incomingEmail || 'doctor@smartmed.com');
  const [password, setPassword] = useState(justRegistered ? '' : 'password123');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If redirected from registration, update fields
  useEffect(() => {
    if (incomingEmail) {
      setEmail(incomingEmail);
    }
  }, [incomingEmail]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    if (isSignUp) {
      const fullName = `${firstName} ${lastName}`.trim();
      const res = await signup({
        name: fullName || 'Clinical Specialist',
        email,
        password,
        role: 'DOCTOR'
      }, true);
      setLoading(false);
      if (res?.success) {
        showToast('Account registered successfully. Session initialized.', 'success', 'Welcome');
        navigate('/dashboard');
      } else {
        setError(res?.error || 'Failed to register account');
      }
    } else {
      const res = await login(email, password);
      setLoading(false);
      if (res?.success) {
        showToast(`Authenticated successfully. Welcome back, ${res.user?.name || email}.`, 'success', 'Session Active');
        navigate('/dashboard');
      } else {
        setError(res?.error || 'Invalid email or password. Please verify your credentials.');
      }
    }
  };

  // Instant 1-Click login for teachers/evaluators without typing passwords
  const handleEvaluatorOneClick = (roleKey) => {
    switchRole(roleKey);
    const user = DEFAULT_USERS[roleKey];
    showToast(`Welcome! Logged in as ${user.name} (${roleKey})`, 'success', 'Evaluator Access');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#121319] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-[#6c5ce7] selection:text-white">
      
      {/* Outer Card Frame (Exact Proportion & Geometry from Reference Image 1) */}
      <div className="w-full max-w-[940px] bg-[#1a1b24] border border-white/10 rounded-[28px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.65)] grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
        {/* Left Visual Inset Panel (5 cols, ~42% width) - Aesthetic Medical Field Atmosphere */}
        <div className="md:col-span-5 p-3.5 sm:p-4">
          <div className="relative h-full min-h-[260px] md:min-h-[520px] rounded-2xl overflow-hidden p-6 sm:p-7 flex flex-col justify-between">
            
            {/* Aesthetic Medical Clinical Background Image with Deep Indigo Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&auto=format&fit=crop&q=80')`
              }}
            />
            {/* High-Contrast Violet/Night Vignette Gradient matching Image 1 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#161722] via-[#1a1b2e]/65 to-[#241c45]/75" />

            {/* Top Bar: Monogram & Back Button */}
            <div className="relative z-10 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <span className="font-mono text-sm font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#94b0da]" />
                  <span>MED-SATHI</span>
                </span>
              </Link>

              <Link
                to="/"
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 border border-white/20 transition-all flex items-center gap-1"
              >
                <span>Back to website</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Bottom Captions & 3-Dash Carousel Indicator (Exact Image 1 Style) */}
            <div className="relative z-10 space-y-4 pt-10 md:pt-0">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  Capturing Safety, <br />
                  Protecting Lives
                </h2>
                <p className="text-xs text-white/70 leading-relaxed max-w-xs">
                  Zero medication errors. Closed-loop bedside clinical intelligence.
                </p>
              </div>

              {/* 3-Dash Carousel Indicator (Matches Image 1) */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-5 h-1 rounded-full bg-white/40" />
                <span className="w-5 h-1 rounded-full bg-white/40" />
                <span className="w-8 h-1 rounded-full bg-white" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Form Panel (7 cols, ~58% width) - Matches Image 1 Button & Input Shapes */}
        <div className="md:col-span-7 p-6 sm:p-9 lg:p-11 flex flex-col justify-center bg-[#1a1b24]">
          
          <div className="max-w-[360px] sm:max-w-[400px] w-full mx-auto space-y-5">
            
            {/* Header: Title & Switch Link */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isSignUp ? 'Create an account' : 'Sign in to account'}
              </h1>
              <div className="flex items-center justify-between text-xs text-white/50 mt-1">
                <span>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <Link
                    to={isSignUp ? "/login" : "/signup"}
                    onClick={(e) => {
                      if (!isSignUp) {
                        // let standard link navigation take them to /signup
                      } else {
                        setIsSignUp(false);
                      }
                    }}
                    className="text-[#94b0da] hover:underline font-semibold transition-colors"
                  >
                    {isSignUp ? 'Log in' : 'Register here →'}
                  </Link>
                </span>
                <Link
                  to="/signup"
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/10 hover:bg-white/20 text-[#dcedff] border border-white/10 transition-all"
                >
                  Registration Page
                </Link>
              </div>
            </div>

            {/* Registration Success Notification Banner */}
            {justRegistered && !error && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-200">Registration Complete!</div>
                  <div className="text-[11px] text-emerald-300/85">
                    Account registered for <span className="font-semibold text-white">{incomingName || email}</span> ({incomingRole || 'Clinician'}). Please enter your password to sign in.
                  </div>
                </div>
              </div>
            )}

            {/* Error Notice */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* If SignUp: Two Side-by-Side Inputs (First Name / Last Name) matching Image 1 */}
              {isSignUp && (
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className="w-full bg-[#242533] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#6c5ce7] focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                    className="w-full bg-[#242533] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#6c5ce7] focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* Email Input (Rounded-xl soft rectangle matching Image 1) */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full bg-[#242533] border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#6c5ce7] focus:outline-none transition-colors"
                />
              </div>

              {/* Password Input with Eye Icon (Matching Image 1) */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#242533] border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#6c5ce7] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Checkbox (Square with rounded corners matching Image 1) */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${
                    agreeTerms ? 'bg-[#6c5ce7] text-white' : 'border border-white/20 bg-[#242533]'
                  }`}
                >
                  {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-[11px] text-white/60">
                  I agree to the <span className="underline text-white/80 hover:text-white cursor-pointer">Terms & Conditions</span>
                </span>
              </div>

              {/* Primary Rounded Rectangle Button (Matching Violet Button in Image 1) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-semibold text-xs sm:text-sm shadow-[0_4px_20px_rgba(108,92,231,0.4)] hover:shadow-[0_4px_25px_rgba(108,92,231,0.6)] transition-all flex items-center justify-center gap-2 mt-1"
              >
                <span>
                  {loading
                    ? 'Processing...'
                    : isSignUp
                    ? 'Create account'
                    : 'Sign in to account'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Divider ("Or register with" / "Or sign in with" - Image 1 style) */}
            <div className="relative flex items-center justify-center pt-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-[#1a1b24] text-[10px] font-mono uppercase tracking-wider text-white/40">
                {isSignUp ? 'Or register with' : 'Or sign in with'}
              </span>
            </div>

            {/* 4 Evaluator Buttons (Styled as Clean Soft-Rounded Rectangles matching Google/Apple in Image 1) */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              
              <button
                type="button"
                onClick={() => handleEvaluatorOneClick('DOCTOR')}
                className="h-10 rounded-xl border border-white/15 bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-2 px-3 text-xs text-white/90 font-medium"
              >
                <Stethoscope className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleEvaluatorOneClick('NURSE')}
                className="h-10 rounded-xl border border-white/15 bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-2 px-3 text-xs text-white/90 font-medium"
              >
                <ClipboardList className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Nurse</span>
              </button>

              <button
                type="button"
                onClick={() => handleEvaluatorOneClick('PHARMACIST')}
                className="h-10 rounded-xl border border-white/15 bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-2 px-3 text-xs text-white/90 font-medium"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">Pharmacist</span>
              </button>

              <button
                type="button"
                onClick={() => handleEvaluatorOneClick('ADMIN')}
                className="h-10 rounded-xl border border-white/15 bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-2 px-3 text-xs text-white/90 font-medium"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">Admin / CMO</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
