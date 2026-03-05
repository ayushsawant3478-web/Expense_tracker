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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">Financial Overview</h1>
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
            <p className="text-slate-400">Welcome back, <span className="text-white font-semibold">{user.username}</span>. Here's your status for {currentMonth}.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 glass p-2 rounded-2xl"
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
            { label: 'Total Income', value: income, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Total Expenses', value: expenses, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-400/10' },
            { label: 'Net Balance', value: netBalance, icon: Wallet, color: 'text-violet-400', bg: 'bg-violet-400/10' },
            { label: 'Monthly Budget', value: currentBudgetAmount, icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-[24px] border-white/5 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-mono font-bold">₹{stat.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </motion.div>
          ))}
        </div>

        {/* Savings Progress & Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass p-8 rounded-[24px] border-white/5 flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Monthly Savings Rate</h3>
              <span className="text-violet-400 font-mono font-bold">{savingsRate}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-5 overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, parseFloat(savingsRate)))}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-violet-500 h-full shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              />
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              * Savings rate is calculated as (Income - Expenses) / Income.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-[24px] border-white/5 bg-violet-500/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-16 h-16 text-violet-500" />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-500" />
              VittVantage Tip
            </h3>
            <p className="text-slate-100 leading-relaxed text-sm">
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
              <div key={i} className="glass p-6 rounded-[24px] border-white/5 card-hover bg-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <suggestion.icon className={`w-4 h-4 ${suggestion.color}`} />
                  </div>
                  <h4 className="font-bold text-sm">{suggestion.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {suggestion.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Budget Alert */}
        <AnimatePresence>
          {budgetExceeded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-medium">Budget Alert: You've exceeded your monthly limit by ₹{(expenses - currentBudgetAmount).toFixed(2)}!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms & Budget */}
          <div className="lg:col-span-1 space-y-8">
            <section className="glass p-8 rounded-[32px] border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Manage Budget</h2>
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter budget in ₹"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveBudget} className="flex-grow py-3 bg-violet-600 rounded-xl font-bold hover:bg-violet-500 transition-all text-white">Save</button>
                    <button onClick={() => setIsEditingBudget(false)} className="px-4 py-3 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-sm text-slate-400 mb-1">Current Monthly Limit</p>
                  <p className="text-2xl font-mono font-bold">₹{currentBudgetAmount.toLocaleString('en-IN')}</p>
                </div>
              )}
            </section>

            <section className="glass p-8 rounded-[32px] border-white/5">
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
            <section className="glass p-8 rounded-[32px] border-white/5">
              <h2 className="text-xl font-bold mb-8">Financial Analytics</h2>
              <ChartComponent transactions={transactions} />
            </section>

            <section className="glass p-8 rounded-[32px] border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
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
                      key={t.id}
                      className="group p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {t.type === 'income' ? <Plus className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold">{t.description}</p>
                          <p className="text-xs text-slate-500 font-mono">{t.date} • {t.category}</p>
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