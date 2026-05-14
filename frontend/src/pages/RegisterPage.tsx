import { useState, useMemo, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Wallet, Check, X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../constants';

const PW_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(p) },
];

const STRENGTH_CONFIG = [
  { label: 'Weak', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { label: 'Weak', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { label: 'Fair', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { label: 'Good', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  { label: 'Strong', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  { label: 'Strong', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
];

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const pwScore = useMemo(() => PW_RULES.filter(r => r.test(password)).length, [password]);
  const strengthCfg = STRENGTH_CONFIG[pwScore];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (pwScore < 5) {
      setError('Password does not meet all requirements');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(username, email, password);
      console.log("RegisterPage after email register - raw user object:", user);
      console.log("RegisterPage after email register - user.role:", user.role);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (e: any) {
      setError(e?.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setSubmitting(true);
      setError('');
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (data.token) {
        const user = loginWithGoogle(data.user, data.token);
        console.log("RegisterPage after Google login - raw user object:", user);
        console.log("RegisterPage after Google login - user.role:", user.role);
        
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Google sign up failed');
      }
    } catch (err) {
      setError('Google sign up failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-10 rounded-[32px] shadow-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4">
            <Wallet className="w-7 h-7" style={{ color: 'var(--text-primary)' }} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h2>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Join Trackify today
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl flex items-center gap-3"
              style={{
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)'
              }}
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {error}
              </p>
            </motion.div>
          )}

          <div>
            <label
              className="block text-sm font-medium mb-1.5 ml-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Username
            </label>
            <input
              type="text"
              required
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                color: 'var(--text-primary)'
              }}
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5 ml-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                color: 'var(--text-primary)'
              }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5 ml-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <input
              type="password"
              required
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                color: 'var(--text-primary)'
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-3 space-y-2">
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-input)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: strengthCfg.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(pwScore / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-bold" style={{ color: strengthCfg.color }}>
                    {strengthCfg.label}
                  </span>
                </div>
                {/* Requirements checklist */}
                <div className="grid grid-cols-1 gap-1">
                  {PW_RULES.map((rule, i) => {
                    const pass = rule.test(password);
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        {pass
                          ? <Check className="w-3 h-3" style={{ color: '#22c55e' }} />
                          : <X className="w-3 h-3" style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />}
                        <span className="text-[11px]" style={{ color: pass ? '#22c55e' : 'var(--text-secondary)', opacity: pass ? 1 : 0.6 }}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5 ml-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                color: 'var(--text-primary)'
              }}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20 mt-4 disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border-card)' }} />
          </div>
          <span
            className="relative px-4 text-sm font-medium"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
          >
            or continue with
          </span>
        </div>

        {/* Google Sign Up */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign up failed. Try again.')}
            theme="filled_black"
            shape="pill"
            width="380"
            text="signup_with"
            useOneTap={false}
          />
        </div>

        <div
          className="mt-8 pt-6 border-t text-center"
          style={{ borderColor: 'var(--border-card)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-violet-500 font-bold hover:text-violet-400">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}