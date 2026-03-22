import { useAuth } from '../context/AuthContext';
import ChatBot from '../components/ChatBot';
import { useExpense } from '../context/ExpenseContext';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, TrendingUp, TrendingDown, Wallet, Calendar, Trash2, Edit2, AlertCircle, Zap, ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import ChartComponent from '../components/ChartComponent';
import Navbar from '../components/Navbar';
import { FINANCIAL_TIPS } from '../constants';
import LiveMarketData from '../components/LiveMarketData';
import GoalTracker from '../components/GoalTracker';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function DashboardPage() {
  const { user, isDemo } = useAuth();
  const { transactions, budgets, getMonthlySummary, addBudget, deleteTransaction } = useExpense();
  const navigate = useNavigate();

  const displayUser = user || { username: isDemo ? 'Demo User' : 'User', email: '', id: 'guest' };

  const [showWelcome, setShowWelcome] = useState(false);

  // Show banner when user loads
  useEffect(() => {
    if (user || isDemo) {
      const key = `trackify_welcomed_${user?.id || 'demo'}`;
      if (!sessionStorage.getItem(key)) {
        setShowWelcome(true);
      }
    }
  }, [user, isDemo]);

  // Auto dismiss after 4 seconds
  useEffect(() => {
    if (showWelcome) {
      const key = `trackify_welcomed_${user?.id || 'demo'}`;
      sessionStorage.setItem(key, 'true');
      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    if (!user && !isDemo) navigate('/login');
  }, [user, isDemo, navigate]);

  useEffect(() => {
    const budget = budgets.find(b => b.month === currentMonth);
    setBudgetAmount(budget?.amount || 0);
  }, [budgets, currentMonth]);

  const { income, expenses, budgetAmount: currentBudgetAmount, netBalance, availableSavings } = getMonthlySummary(currentMonth);
  const budgetExceeded = currentBudgetAmount > 0 && expenses > currentBudgetAmount;

  const handleSaveBudget = () => {
    addBudget({ month: currentMonth, amount: budgetAmount });
    setIsEditingBudget(false);
  };

  const goToPrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 2);
    setCurrentMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  const goToNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month);
    setCurrentMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  const isCurrentMonth = () => {
    const now = new Date();
    const current = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    return currentMonth === current;
  };

  const getMonthLabel = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const savingsRate = income > 0 ? ((availableSavings / income) * 100).toFixed(1) : "0.0";

  const randomTip = useMemo(() => {
    return FINANCIAL_TIPS[Math.floor(Math.random() * FINANCIAL_TIPS.length)];
  }, []);

  const exportToExcel = () => {
    const summary = [
      ['Trackify — Monthly Report', ''],
      ['Month', getMonthLabel()],
      ['Generated On', new Date().toLocaleDateString('en-IN')],
      ['', ''],
      ['SUMMARY', ''],
      ['Total Income', income],
      ['Total Expenses', expenses],
      ['Net Balance', netBalance],
      ['Monthly Budget', currentBudgetAmount],
      ['Savings Rate', `${savingsRate}%`],
    ];
    const transactionRows = [
      ['Date', 'Description', 'Type', 'Category', 'Amount (₹)'],
      ...monthlyTransactions.slice().reverse().map(t => [
        t.date,
        t.description,
        t.type === 'income' ? 'Income' : 'Expense',
        t.category,
        t.type === 'income' ? t.amount : -t.amount
      ])
    ];
    const wb = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.aoa_to_sheet(summary);
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    const txSheet = XLSX.utils.aoa_to_sheet(transactionRows);
    txSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, txSheet, 'Transactions');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Trackify_${currentMonth}.xlsx`);
  };

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
     if (s <= 0) return {
       name: "No Savings", range: "₹0 or Negative",
       theme: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
       suggestions: [
         { title: "Cut Expenses", desc: "Reduce discretionary spends and renegotiate bills to lower recurring costs." },
         { title: "Track Spending", desc: "Use category tracking to spot leaks and set weekly caps." },
         { title: "Start Emergency Fund", desc: "Park small amounts regularly to build a 1-month buffer." }
       ]
     };
     if (s <= 2000) return {
       name: "Starter", range: "₹1 - ₹2,000",
       theme: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
       suggestions: [
         { title: "Digital Gold", desc: "Begin with tiny ticket sizes to build a habit." },
         { title: "Recurring Deposit", desc: "Automate a monthly RD with a fixed term." },
         { title: "Round-up Apps", desc: "Use round-up savings to capture spare change." }
       ]
     };
     if (s <= 5000) return {
       name: "Growing", range: "₹2,000 - ₹5,000",
       theme: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
       suggestions: [
         { title: "Mutual Fund SIP", desc: "Start diversified equity or hybrid SIPs." },
         { title: "Liquid Funds", desc: "Keep short-term surplus accessible and low-risk." },
         { title: "Open PPF", desc: "Lock long-term savings with tax benefits." }
       ]
     };
     if (s <= 10000) return {
       name: "Moderate", range: "₹5,000 - ₹10,000",
       theme: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
       suggestions: [
         { title: "Index Funds", desc: "Allocate core exposure to broad market indices." },
         { title: "US ETFs", desc: "Add international diversification within limits." },
         { title: "Fixed Deposits", desc: "Stabilize portion with assured returns." }
       ]
     };
     if (s <= 25000) return {
       name: "Strong", range: "₹10,000 - ₹25,000",
       theme: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
       suggestions: [
         { title: "Diversified Portfolio", desc: "Balance equity, debt, and international exposure." },
         { title: "Blue Chip Stocks", desc: "Add quality large-caps for stability." },
         { title: "NPS Pension", desc: "Contribute for long-term retirement corpus and tax." }
       ]
     };
     return {
       name: "Excellent", range: "Above ₹25,000",
       theme: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
       suggestions: [
         { title: "REITs", desc: "Gain real estate exposure via yield-focused trusts." },
         { title: "Emergency Fund 6m", desc: "Scale buffer to six months of expenses." },
         { title: "ELSS Funds", desc: "Use tax-saving equity funds for Section 80C." }
       ]
     };
   };
 
   const investmentTier = useMemo(() => getInvestmentPlan(availableSavings), [availableSavings]);
 
   const savingsTier: 'none' | 'starter' | 'growing' | 'moderate' | 'good' | 'excellent' = useMemo(() => {
    if (availableSavings <= 0) return 'none';
    if (availableSavings < 2000) return 'starter';
    if (availableSavings < 5000) return 'growing';
    if (availableSavings < 10000) return 'moderate';
    if (availableSavings < 25000) return 'good';
    return 'excellent';
  }, [availableSavings]);

  function AnimatedStat({ value }: { value: number }) {
    const nodeRef = useRef<HTMLParagraphElement | null>(null);
    useEffect(() => {
      const el = nodeRef.current;
      if (!el) return;
      const start = performance.now();
      const duration = 900;
      const to = value;
      const step = (t: number) => {
        const progress = Math.min(1, (t - start) / duration);
        const current = to * progress;
        el.textContent = `₹${current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [value]);
    return <p ref={nodeRef} className="text-3xl font-mono font-extrabold" />;
  }

  if (!user && !isDemo) return null;
  if (!displayUser?.username) return null;

  const safeUsername = displayUser?.username || 'User';
  const safeInitial = safeUsername.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome Banner */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative overflow-hidden mb-6"
              style={{
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: '1.5rem'
              }}
            >
              <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold text-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    }}
                  >
                    {safeInitial}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {getGreeting()},
                      </span>
                      <span
                        className="text-base font-extrabold tracking-tight"
                        style={{
                          background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {safeUsername}!
                      </span>
                      <span className="text-base">👋</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Ready to track your finances today?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                to="/analytics"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  color: '#a78bfa'
                }}
              >
                View Analytics →
              </Link>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="p-2 rounded-xl transition-all hover:bg-white/10 hover:scale-110"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-[2px] bg-violet-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Banner */}
        {isDemo && (
          <div
            className="mb-6 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <p className="text-sm font-medium text-violet-400">
              👋 You are in Demo Mode.{' '}
              <Link to="/register" className="underline font-bold">Create a free account</Link>{' '}
              to save your data.
            </p>
            <Link
              to="/register"
              className="px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-500 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        )}

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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
            <p style={{ color: 'var(--text-secondary)' }}>
              Welcome back,{' '}
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {safeUsername}
              </span>
              . Here's your status for{' '}
              <span className="font-semibold text-violet-400">{getMonthLabel()}</span>.
            </p>
          </motion.div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Month Switcher */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 p-2 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="font-mono font-bold text-sm min-w-[140px] text-center">{getMonthLabel()}</span>
              </div>
              <button
                onClick={goToNextMonth}
                disabled={isCurrentMonth()}
                className={`p-2 rounded-xl transition-colors ${isCurrentMonth() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}
                style={{ color: 'var(--text-secondary)' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Export Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#10b981'
              }}
            >
              <Download className="w-4 h-4" />
              Export Excel
            </motion.button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Income', value: income, icon: TrendingUp, color: 'text-blue-400' },
            { label: 'Total Expenses', value: expenses, icon: TrendingDown, color: 'text-rose-400' },
            { label: 'Net Savings', value: availableSavings, icon: Wallet, color: 'text-violet-400' },
            { label: 'Monthly Budget', value: currentBudgetAmount, icon: AlertCircle, color: 'text-cyan-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-[24px] card-hover"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              <AnimatedStat value={stat.value} />
            </motion.div>
          ))}
        </div>

        {/* Quick Add Transaction Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-400" />
              Quick Add Transaction
            </h2>
            <Link 
              to="/add-transaction" 
              className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              Full Page Editor <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-8 rounded-[32px] relative overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', perspective: '1200px' }}>
                <div className="flex p-1.5 bg-white/5 rounded-2xl mb-8 relative z-10 border border-white/5 max-w-md mx-auto">
                  <button
                    onClick={() => setActiveTab('expense')}
                    className={`flex-grow py-3 rounded-xl text-sm font-extrabold transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === 'expense' ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    Expense
                  </button>
                  <button
                    onClick={() => setActiveTab('income')}
                    className={`flex-grow py-3 rounded-xl text-sm font-extrabold transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === 'income' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Income
                  </button>
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeTab}
                      initial={{ rotateY: activeTab === 'expense' ? -90 : 90, opacity: 0, scale: 0.9 }}
                      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                      exit={{ rotateY: activeTab === 'expense' ? 90 : -90, opacity: 0, scale: 0.9 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        mass: 1,
                        duration: 0.6 
                      }}
                      style={{ 
                        backfaceVisibility: 'hidden', 
                        transformStyle: 'preserve-3d',
                        width: '100%'
                      }}
                    >
                      <div className="p-2">
                        {activeTab === 'expense' ? <ExpenseForm /> : <IncomeForm />}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-[32px] h-full flex flex-col justify-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                <h3 className="text-lg font-bold mb-4">Why track daily?</h3>
                <ul className="space-y-4">
                  {[
                    "Spot spending leaks early",
                    "Maintain accurate monthly budgets",
                    "Build better financial discipline",
                    "Never miss a recurring expense"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-violet-400" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Savings Progress & Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-card p-8 rounded-[24px] flex flex-col justify-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Monthly Savings Rate — {getMonthLabel()}</h3>
              <span className="text-violet-400 font-mono font-bold">{savingsRate}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-violet-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, parseFloat(savingsRate)))}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
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
              Trackify Tip
            </h3>
            <p className="leading-relaxed text-sm" style={{ color: 'var(--text-primary)' }}>"{randomTip}"</p>
          </motion.div>
        </div>

        {/* Financial Health Suggestions */}
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
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{suggestion.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Investment Suggestions - RESTORED AND REPOSITIONED */}
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
            <div className={`px-4 py-2 rounded-full border ${investmentTier.theme.border} ${investmentTier.theme.bg}`}>
              <span className={`text-sm font-bold ${investmentTier.theme.text}`}>{investmentTier.name}: {investmentTier.range}</span>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[24px] mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Net Savings for {getMonthLabel()}</p>
            <p className={`text-3xl font-mono font-bold ${investmentTier.theme.text}`}>₹{availableSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
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

        {/* Goals & Market Data */}
        <div className="flex flex-col gap-12 mb-12">
          <GoalTracker key={currentMonth} monthlySavings={availableSavings} />
          <div className="w-full h-px" style={{ background: 'var(--border-card)' }} />
          <LiveMarketData savingsTier={savingsTier} />
        </div>

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
          {/* Left Column - Compact Budget & Goals Info */}
          <div className="lg:col-span-1 space-y-8">
            <section className="glass-card p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Monthly Budget</h2>
                <button onClick={() => setIsEditingBudget(!isEditingBudget)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-violet-500">
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
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Limit for {getMonthLabel()}</p>
                      <p className="text-3xl font-mono font-bold">₹{currentBudgetAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Spent</p>
                      <p className={`text-xl font-mono font-bold ${budgetExceeded ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {((expenses / (currentBudgetAmount || 1)) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`${budgetExceeded ? 'bg-rose-500' : 'bg-emerald-500'} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (expenses / (currentBudgetAmount || 1)) * 100)}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              )}
            </section>
            
            {/* Quick Link to Add Page */}
            <Link 
              to="/add-transaction"
              className="block glass-card p-8 rounded-[32px] group relative overflow-hidden transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.1))', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition-colors">Add New Record</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Jump to the dedicated transaction editor for more details.</p>
              </div>
              <Plus className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity" />
            </Link>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <h2 className="text-xl font-bold mb-8">Financial Analytics — {getMonthLabel()}</h2>
              <ChartComponent transactions={monthlyTransactions} />
            </section>

            <section className="glass-card p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Transactions — {getMonthLabel()}</h2>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{monthlyTransactions.length} total</span>
              </div>
              <div className="space-y-4">
                {monthlyTransactions.length === 0 ? (
                  <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No transactions for {getMonthLabel()}.</p>
                  </div>
                ) : (
                  monthlyTransactions.slice().reverse().map((t) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={`${t.type}-${t.id}`}
                      className="group p-4 rounded-2xl flex items-center justify-between transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
                          style={{ boxShadow: t.type === 'income' ? '0 0 12px rgba(16,185,129,0.25)' : '0 0 12px rgba(244,63,94,0.25)' }}
                        >
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
      <ChatBot />
    </div>
  );
}