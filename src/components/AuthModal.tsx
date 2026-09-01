import React, { useState } from 'react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { saveUserProfileToFirestore } from '../services/firebaseService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Luma Member',
        photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfileToFirestore(profile);
      onSuccess(profile);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || (!password && mode !== 'forgot')) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          role: 'customer',
        };
        onSuccess(profile);
        onClose();
      } else if (mode === 'register') {
        if (!displayName) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await updateProfile(user, {
          displayName: displayName,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
        });

        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phone: phone,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
          role: role,
          createdAt: new Date().toISOString(),
        };

        await saveUserProfileToFirestore(profile);
        onSuccess(profile);
        onClose();
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Password reset link sent to your email address!');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please login instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#006d2f]/10 text-[#006d2f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                {mode === 'login' ? 'login' : mode === 'register' ? 'person_add' : 'lock_reset'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#141b2b]">
                {mode === 'login' ? 'Account Login (লগইন)' : mode === 'register' ? 'Create Account (রেজিস্ট্রেশন)' : 'Reset Password'}
              </h3>
              <p className="text-xs text-[#3c4a3d]/75">Firebase Secure Authentication</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f0f4ff] p-1 rounded-2xl my-4 text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-[#006d2f] shadow-xs'
                : 'text-[#3c4a3d]/80 hover:text-[#141b2b]'
            }`}
          >
            Login (লগইন)
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-[#006d2f] shadow-xs'
                : 'text-[#3c4a3d]/80 hover:text-[#141b2b]'
            }`}
          >
            Register (নতুন একাউন্ট)
          </button>
        </div>

        {/* Google 1-Click Sign-In */}
        {mode !== 'forgot' && (
          <div className="space-y-3 mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-11 bg-white border border-slate-300 hover:bg-slate-50 text-[#141b2b] rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-xs active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#3c4a3d]/50 my-2">
              <div className="h-px bg-slate-200 flex-1" />
              <span>or continue with email</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
          </div>
        )}

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#006d2f] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-[#3c4a3d] uppercase mb-1">
                  Full Name (আপনার নাম) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Hamza"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3c4a3d] uppercase mb-1">
                  Phone Number (মোবাইল নম্বর)
                </label>
                <input
                  type="tel"
                  placeholder="017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3c4a3d] uppercase mb-1">
                  Account Type (একাউন্ট টাইপ)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      role === 'customer'
                        ? 'bg-[#006d2f] text-white border-[#006d2f]'
                        : 'bg-[#f9f9ff] text-[#3c4a3d] border-slate-200'
                    }`}
                  >
                    Customer (ক্রেতা)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      role === 'seller'
                        ? 'bg-[#006d2f] text-white border-[#006d2f]'
                        : 'bg-[#f9f9ff] text-[#3c4a3d] border-slate-200'
                    }`}
                  >
                    Seller (দোকানদার)
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-[#3c4a3d] uppercase mb-1">
              Email Address (ইমেইল) *
            </label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-[#3c4a3d] uppercase">Password (পাসওয়ার্ড) *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[#006d2f] font-semibold hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#006d2f] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#005523] active:scale-[0.98] transition-all disabled:opacity-60 mt-4"
          >
            {loading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  {mode === 'login' ? 'login' : mode === 'register' ? 'how_to_reg' : 'send'}
                </span>
                <span>
                  {mode === 'login'
                    ? 'Login to Account (লগইন)'
                    : mode === 'register'
                    ? 'Create My Account (রেজিস্টার)'
                    : 'Send Password Reset Email'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-4 text-center">
          {mode === 'forgot' ? (
            <button
              onClick={() => setMode('login')}
              className="text-xs text-[#006d2f] font-bold hover:underline"
            >
              Back to Login
            </button>
          ) : (
            <p className="text-[11px] text-[#3c4a3d]/70">
              {mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                }}
                className="text-[#006d2f] font-bold hover:underline"
              >
                {mode === 'login' ? 'Register Now (নতুন একাউন্ট খুলুন)' : 'Login here (লগইন করুন)'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
