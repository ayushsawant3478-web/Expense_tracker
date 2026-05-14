import { useEffect, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';
import { Edit2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function BudgetPage() {
  const { budgets, addBudget, getMonthlySummary, selectedMonth, setSelectedMonth } = useExpense();
  const { expenses } = getMonthlySummary(selectedMonth);
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const getMonthLabel = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const goToPrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2);
    setSelectedMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  const goToNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month);
    setSelectedMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedMonth === `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const budget = budgets.find(b => b.month === selectedMonth);
    setBudgetAmount(budget?.amount || 0);
  }, [budgets, selectedMonth]);

  const handleSave = () => {
    addBudget({ month: selectedMonth, amount: budgetAmount });
    setIsEditing(false);
  };

  const percentage = budgetAmount > 0 ? Math.min((expenses / budgetAmount) * 100, 100) : 0;
  const remaining = budgetAmount - expenses;
  const exceeded = expenses > budgetAmount && budgetAmount > 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Budget</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your spending limit for <span className="font-semibold text-violet-400">{getMonthLabel()}</span></p>
            </div>
            {/* Month Switcher */}
            <div className="flex items-center gap-2 p-2 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <button onClick={goToPrevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors" style={{ color: 'var(--text-secondary)' }}>
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
            </div>
          </div>

          <div className="p-8 rounded-[32px] mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Budget — {getMonthLabel()}</h2>
              <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-violet-500">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            {isEditing ? (
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
                  <button onClick={handleSave} className="flex-grow py-3 bg-violet-600 rounded-xl font-bold hover:bg-violet-500 transition-all text-white">Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-3 bg-white/5 rounded-xl font-bold hover:bg-white/10 transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Budget', value: `₹${budgetAmount.toLocaleString('en-IN')}`, color: 'text-violet-400' },
                    { label: 'Spent', value: `₹${expenses.toLocaleString('en-IN')}`, color: 'text-rose-400' },
                    { label: 'Remaining', value: `₹${Math.abs(remaining).toLocaleString('en-IN')}`, color: exceeded ? 'text-rose-400' : 'text-emerald-400' },
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl text-center" style={{ background: 'var(--bg-input)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                      <p className={`text-lg font-mono font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Spent</span>
                    <span className={exceeded ? 'text-rose-400' : 'text-violet-400'} >{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: exceeded ? '#e11d48' : percentage > 80 ? '#f59e0b' : '#7c3aed' }}
                    />
                  </div>
                </div>

                {exceeded && (
                  <div className="p-4 rounded-2xl text-rose-400 text-sm font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    ⚠️ You've exceeded your budget by ₹{Math.abs(remaining).toLocaleString('en-IN')}!
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}