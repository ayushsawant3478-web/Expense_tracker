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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-[32px] shadow-2xl border-white/5"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4">
            <Wallet className="text-white w-7 h-7" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to manage your wealth</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
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
            className="w-full py-4 bg-white/5 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Zap className="w-4 h-4 text-violet-500" />
            View Demo
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-400 text-sm">
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
