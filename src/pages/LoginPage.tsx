import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { motion } from 'motion/react';
import { Wallet, Zap } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../constants';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, setIsDemo } = useAuth();
  const { loadDemoData } = useExpense();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Invalid email or password');
      setTimeout(() => setError(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDemo = () => {
    setIsDemo(true);
    loadDemoData();
    login('demo@vittvantage.com', 'demo123');
    navigate('/dashboard');
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('vittvantage_token', data.token);
        localStorage.setItem('vittvantage_user', JSON.stringify(data.user));
        navigate('/dashboard');
        window.location.reload();
      } else {
        setError(data.error || 'Google login failed');
      }
    } catch (err) {
      setError('Google login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card p-10 rounded-[32px] shadow-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4">
            <Wallet className="w-7 h-7" style={{ color: 'var(--text-primary)' }} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Sign in to manage your wealth</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-3 p-3 rounded-xl flex items-center gap-3"
              style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}
              aria-live="assertive"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{error}</p>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              required
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20 mt-4 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleViewDemo}
            className="w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}
          >
            <Zap className="w-4 h-4 text-violet-500" />
            View Demo
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border-card)' }} />
          </div>
          <span className="relative px-4 text-sm font-medium" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            or continue with
          </span>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed. Try again.')}
            theme="filled_black"
            shape="pill"
            width="100%"
            text="signin_with"
          />
        </div>

        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'var(--border-card)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-500 font-bold hover:text-violet-400">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}