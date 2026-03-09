import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Edit2, AlertCircle, Zap } from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import ChartComponent from '../components/ChartComponent';
import Navbar from '../components/Navbar';
import { FINANCIAL_TIPS } from '../constants';
import LiveMarketData from '../components/LiveMarketData';
import GoalTracker from '../components/GoalTracker';
import { useEffect as ReactUseEffect, useRef } from 'react';

export default function DashboardPage() {
  const { user, isDemo } = useAuth();
  const { transactions, budgets, getMonthlySummary, addBudget, deleteTransaction } = useExpense();
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const [budgetAmount, setBudgetAmount] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const budget = budgets.find(b => b.month === currentMonth);
    setBudgetAmount(budget?.amount || 0);
  }, [budgets, currentMonth]);

  const { income, expenses, budgetAmount: currentBudgetAmount, netBalance } = getMonthlySummary(currentMonth);
  const budgetExceeded = currentBudgetAmount > 0 && expenses > currentBudgetAmount;

  const handleSaveBudget = () => {
    addBudget({ month: currentMonth, amount: budgetAmount });
    setIsEditingBudget(false);
  };

  const savingsRate = income > 0 ? ((netBalance / income) * 100).toFixed(1) : "0.0";

  const randomTip = useMemo(() => {
    return FINANCIAL_TIPS[Math.floor(Math.random() * FINANCIAL_TIPS.length)];
  }, []);

  const getSuggestions = () => {
    const suggestions = [];
    if (parseFloat(savingsRate) < 20) {
      suggestions.push({
        title: "Boost Your Savings",
        desc: "Your savings rate is below 20%. Try to cut non-essential expenses like dining out or entertainment by 10% this month.",
        icon: TrendingUp,
        color: "text-violet-400"
      });
    }
    if (budgetExceeded) {
      suggestions.push({
        title: "Budget Overrun",
        desc: "You've exceeded your budget. Review your largest expense categories and set stricter limits for next month.",
        icon: AlertCircle,
        color: "text-rose-400"
      });
    }
    if (income === 0) {
      suggestions.push({
        title: "Income Stream",
        desc: "No income recorded yet for this month. Ensure all your revenue sources are logged for accurate tracking.",
        icon: Wallet,
        color: "text-blue-400"
      });
    }
    if (suggestions.length === 0) {
      suggestions.push({
        title: "Excellent Progress!",
        desc: "You're managing your finances well. Consider investing your surplus into a diversified portfolio.",
        icon: Zap,
        color: "text-blue-400"
      });
    }
    return suggestions;
  };
  const getInvestmentPlan = (s: number) => {
    if (s <= 0) {
      return {
        name: "No Savings",
        range: "₹0 or Negative",
        theme: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
        suggestions: [
          { title: "Cut Expenses", desc: "Reduce discretionary spends and renegotiate bills to lower recurring costs." },
          { title: "Track Spending", desc: "Use category tracking to spot leaks and set weekly caps." },
          { title: "Start Emergency Fund", desc: "Park small amounts regularly to build a 1-month buffer." }
        ]
      };
    }
    if (s > 0 && s <= 2000) {
      return {
        name: "Starter",
        range: "₹1 - ₹2,000",
        theme: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        suggestions: [
          { title: "Digital Gold", desc: "Begin with tiny ticket sizes to build a habit." },
          { title: "Recurring Deposit", desc: "Automate a monthly RD with a fixed term." },
          { title: "Round-up Apps", desc: "Use round-up savings to capture spare change." }
        ]
      };
    }
    if (s > 2000 && s <= 5000) {
      return {
        name: "Growing",
        range: "₹2,000 - ₹5,000",
        theme: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        suggestions: [
          { title: "Mutual Fund SIP", desc: "Start diversified equity or hybrid SIPs." },
          { title: "Liquid Funds", desc: "Keep short-term surplus accessible and low-risk." },
          { title: "Open PPF", desc: "Lock long-term savings with tax benefits." }
        ]
      };
    }
    if (s > 5000 && s <= 10000) {
      return {
        name: "Moderate",
        range: "₹5,000 - ₹10,000",
        theme: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        suggestions: [
          { title: "Index Funds", desc: "Allocate core exposure to broad market indices." },
          { title: "US ETFs", desc: "Add international diversification within limits." },
          { title: "Fixed Deposits", desc: "Stabilize portion with assured returns." }
        ]
      };
    }
    if (s > 10000 && s <= 25000) {
      return {
        name: "Strong",
        range: "₹10,000 - ₹25,000",
        theme: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        suggestions: [
          { title: "Diversified Portfolio", desc: "Balance equity, debt, and international exposure." },
          { title: "Blue Chip Stocks", desc: "Add quality large-caps for stability." },
          { title: "NPS Pension", desc: "Contribute for long-term retirement corpus and tax." }
        ]
      };
    }
    return {
      name: "Excellent",
      range: "Above ₹25,000",
      theme: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
      suggestions: [
        { title: "REITs", desc: "Gain real estate exposure via yield-focused trusts." },
        { title: "Emergency Fund 6m", desc: "Scale buffer to six months of expenses." },
        { title: "ELSS Funds", desc: "Use tax-saving equity funds for Section 80C." }
      ]
    };
  };
  const investmentTier = useMemo(() => getInvestmentPlan(netBalance), [netBalance]);
  const savingsTier: 'none' | 'starter' | 'growing' | 'moderate' | 'good' | 'excellent' = useMemo(() => {
    if (netBalance <= 0) return 'none';
    if (netBalance < 2000) return 'starter';
    if (netBalance < 5000) return 'growing';
    if (netBalance < 10000) return 'moderate';
    if (netBalance < 25000) return 'good';
    return 'excellent';
  }, [netBalance]);

  if (!user) return null;

  function AnimatedStat({ value }: { value: number }) {
    const nodeRef = useRef<HTMLParagraphElement | null>(null);
    ReactUseEffect(() => {
      const el = nodeRef.current;
      if (!el) return;
      const start = performance.now();
      const duration = 900;
      const from = 0;
      const to = value;
      const step = (t: number) => {
        const progress = Math.min(1, (t - start) / duration);
        const current = from + (to - from) * progress;
        el.textContent = `₹${current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [value]);
    return <p ref={nodeRef} className="text-3xl font-mono font-extrabold" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-extrabold tracking-tight title-gradient">Financial Overview</h1>
              {isDemo && (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold rounded-full uppercase tracking-widest"
                >
                  Demo Mode
                </motion.span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.username}</span>. Here's your status for {currentMonth}.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 p-2 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
          >
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <Calendar className="w-5 h-5 text-slate-400" />
            </button>
            <span className="font-mono font-bold text-sm px-4">{currentMonth}</span>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Income', value: income, icon: TrendingUp, color: 'text-blue-400', tint: 'rgba(59,130,246,0.05)', glow: '0 0 20px rgba(59,130,246,0.3)', accent: '#2563eb' },
            { label: 'Total Expenses', value: expenses, icon: TrendingDown, color: 'text-rose-400', tint: 'rgba(239,68,68,0.05)', glow: '0 0 20px rgba(239,68,68,0.3)', accent: '#ef4444' },
            { label: 'Net Balance', value: netBalance, icon: Wallet, color: 'text-violet-400', tint: 'rgba(139,92,246,0.05)', glow: '0 0 20px rgba(139,92,246,0.3)', accent: '#7c3aed' },
            { label: 'Monthly Budget', value: currentBudgetAmount, icon: AlertCircle, color: 'text-cyan-400', tint: 'rgba(6,182,212,0.05)', glow: '0 0 20px rgba(6,182,212,0.3)', accent: '#06b6d4' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-[24px] card-hover relative overflow-hidden"
              style={{
                background: `linear-gradient(${stat.tint}, ${stat.tint}), var(--bg-card)`,
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.accent, opacity: 0.6 }} />
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ boxShadow: stat.glow, background: 'rgba(255,255,255,0.06)' }}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              <AnimatedStat value={stat.value} />
            </motion.div>
          ))}
        </div>

        {/* Savings Progress & Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-card p-8 rounded-[24px] flex flex-col justify-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Monthly Savings Rate</h3>
              <span className="text-violet-400 font-mono font-bold">{savingsRate}%</span>
            </div>
            <div className="apple-progress">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, parseFloat(savingsRate)))}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="apple-progress-fill"
              />
            </div>
            <p className="text-xs mt-4 italic" style={{ color: 'var(--text-secondary)' }}>
              * Savings rate is calculated as (Income - Expenses) / Income.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 rounded-[24px] relative overflow-hidden group"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-16 h-16 text-violet-500" />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-500" />
              VittVantage Tip
            </h3>
            <p className="leading-relaxed text-sm" style={{ color: 'var(--text-primary)' }}>
              "{randomTip}"
            </p>
          </motion.div>
        </div>

        {/* Suggestions Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            Financial Health Suggestions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getSuggestions().map((suggestion, i) => (
              <div key={i} className="glass-card p-6 rounded-[24px] card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
                    <suggestion.icon className={`w-4 h-4 ${suggestion.color}`} />
                  </div>
                  <h4 className="font-bold text-sm">{suggestion.title}</h4>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {suggestion.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className={`${investmentTier.theme.text} w-5 h-5`} />
              Investment Suggestions
            </h2>
            <div className={`px-4 py-2 rounded-full border ${investmentTier.theme.border} ${investmentTier.theme.bg} flex items-center gap-3`}>
              <span className={`text-sm font-bold ${investmentTier.theme.text}`}>{investmentTier.name}: {investmentTier.range}</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[24px] mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Current Monthly Net Savings</p>
            <p className={`text-3xl font-mono font-bold ${investmentTier.theme.text}`}>₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={investmentTier.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {investmentTier.suggestions.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-6 rounded-[24px] border ${investmentTier.theme.border} card-hover ${investmentTier.theme.bg}`}
                >
                  <h4 className="font-bold text-sm mb-2">{s.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <GoalTracker />

        <LiveMarketData savingsTier={savingsTier} />

        {/* Budget Alert */}
        <AnimatePresence>
          {budgetExceeded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-medium">Budget Alert: You've exceeded your monthly limit by ₹{(expenses - currentBudgetAmount).toFixed(2)}!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms & Budget */}
          <div className="lg:col-span-1 space-y-8">
            <section className="glass-card p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Budget</h2>
                <button 
                  onClick={() => setIsEditingBudget(!isEditingBudget)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-violet-500"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              
              {isEditingBudget ? (
                <div className="space-y-4">
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(parseFloat(e.target.value))}
                    className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                    placeholder="Enter budget in ₹"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveBudget} className="flex-grow py-3 bg-violet-600 rounded-xl font-bold hover:bg-violet-500 transition-all text-white">Save</button>
                    <button onClick={() => setIsEditingBudget(false)} className="px-4 py-3 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current Monthly Limit</p>
                  <p className="text-2xl font-mono font-bold">₹{currentBudgetAmount.toLocaleString('en-IN')}</p>
                </div>
              )}
            </section>

            <section className="glass-card p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <div className="flex p-1 bg-white/5 rounded-2xl mb-6">
                <button 
                  onClick={() => setActiveTab('expense')}
                  className={`flex-grow py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'expense' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Expense
                </button>
                <button 
                  onClick={() => setActiveTab('income')}
                  className={`flex-grow py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'income' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Income
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'expense' ? <ExpenseForm /> : <IncomeForm />}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>

          {/* Right Column: Charts & History */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <h2 className="text-xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Financial Analytics</h2>
              <ChartComponent transactions={transactions} />
            </section>

            <section className="glass-card p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h2>
                <button className="text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors">View All</button>
              </div>
              
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No transactions yet. Start by adding one!</p>
                  </div>
                ) : (
                  transactions.slice().reverse().map((t) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={`${t.type}-${t.id}`}
                      className="group p-4 rounded-2xl flex items-center justify-between transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`} style={{ boxShadow: t.type === 'income' ? '0 0 12px rgba(16,185,129,0.25)' : '0 0 12px rgba(244,63,94,0.25)' }}>
                          {t.type === 'income' ? <Plus className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>{t.description}</p>
                          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{t.date} • {t.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <p className={`font-mono font-bold text-lg ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </p>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
