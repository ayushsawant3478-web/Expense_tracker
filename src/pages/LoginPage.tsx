import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { motion } from 'motion/react';
import { Wallet, Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, setIsDemo } = useAuth();
  const { loadDemoData } = useExpense();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  const handleViewDemo = () => {
    setIsDemo(true);
    loadDemoData();
    login('demo@vittvantage.com', 'demo123');
    navigate('/dashboard');
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
            className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20 mt-4"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleViewDemo}
            className="w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 mt-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}
          >
            <Zap className="w-4 h-4 text-violet-500" />
            View Demo
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
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
