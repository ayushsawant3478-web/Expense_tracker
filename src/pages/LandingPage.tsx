import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight, Zap, PieChart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';

export default function LandingPage() {
  const { setIsDemo } = useAuth();
  const { loadDemoData } = useExpense();
  const navigate = useNavigate();

  const handleViewDemo = () => {
    setIsDemo(true);
    loadDemoData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VittVantage</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-full hover:bg-slate-100 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8 text-white">
              Master your <span className="text-violet-500">wealth</span> with precision.
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
              Track every rupee, set smart budgets, and visualize your financial journey with our premium space-themed manager.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="group px-8 py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all flex items-center gap-2 shadow-xl shadow-violet-500/20">
                Start Tracking Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={handleViewDemo}
                className="px-8 py-4 bg-slate-900/40 text-white font-bold rounded-2xl border border-slate-800/50 hover:bg-slate-800/60 transition-all"
              >
                View Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 glass rounded-[32px] p-8 shadow-2xl overflow-hidden border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Total Balance</p>
                  <p className="text-4xl font-mono font-bold">₹45,250.00</p>
                </div>
                <div className="w-12 h-12 bg-violet-600/20 rounded-full flex items-center justify-center">
                  <Zap className="text-violet-500 w-6 h-6" />
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Rent & Utilities', amount: '₹12,000', color: 'bg-violet-600' },
                  { label: 'Groceries', amount: '₹4,500', color: 'bg-blue-500' },
                  { label: 'Entertainment', amount: '₹2,200', color: 'bg-blue-400' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 ${item.color} rounded-full`} />
                      <span className="font-medium text-white">{item.label}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 z-20 glass p-4 rounded-2xl border-white/10 shadow-xl"
            >
              <PieChart className="text-violet-500 w-8 h-8" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 z-20 glass p-4 rounded-2xl border-white/10 shadow-xl"
            >
              <ShieldCheck className="text-blue-400 w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="text-violet-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-time Tracking</h3>
            <p className="text-slate-400 leading-relaxed">Log your expenses instantly as they happen. Stay on top of your spending without the lag.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <PieChart className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Visual Insights</h3>
            <p className="text-slate-400 leading-relaxed">Beautiful charts and reports that help you understand where your money goes each month.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-emerald-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Secure & Private</h3>
            <p className="text-slate-400 leading-relaxed">Your financial data is yours alone. We prioritize your privacy and security above all else.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
