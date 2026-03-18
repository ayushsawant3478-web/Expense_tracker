import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGoal } from '../context/GoalContext';
import { useExpense } from '../context/ExpenseContext';
import { Target, Plus, Trash2, PiggyBank, Calendar, Zap, AlertCircle, X } from 'lucide-react';

interface GoalTrackerProps {
  key?: string;
  monthlySavings: number;
}

export default function GoalTracker({ monthlySavings }: GoalTrackerProps) {
  const { goals, addGoal, updateGoalSavings, deleteGoal } = useGoal();
  const { getMonthlySummary, allocatedToGoals, setAllocatedToGoals } = useExpense();
  const currentMonth = new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0');
  const { availableSavings: liveSavings } = getMonthlySummary(currentMonth);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState<number>(0);
  const [saved, setSaved] = useState<number>(0);
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  const progressColor = (progress: number, overdue: boolean) => {
    if (progress >= 100) return 'bg-emerald-500';
    if (overdue) return 'bg-rose-500';
    return progress < 50 ? 'bg-rose-500' : 'bg-violet-500';
  };

  const daysRemaining = (deadlineStr: string) => {
    if (!deadlineStr) return null;
    const d = new Date(deadlineStr);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleAddGoal = async () => {
    if (!name || target <= 0) return;
    await addGoal({
      name,
      target_amount: target,
      saved_amount: saved,
      deadline,
      progress: 0
    } as any);
    setShowForm(false);
    setName('');
    setTarget(0);
    setSaved(0);
    setDeadline(new Date().toISOString().split('T')[0]);
  };

  const handleAddMoney = async (id: string, currentSaved: number) => {
    if (!addAmount || addAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    if (addAmount > liveSavings) {
      setErrorMsg(`You cannot add more than your available savings of ₹${liveSavings.toLocaleString('en-IN')}`);
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const newAmount = currentSaved + addAmount;
    await updateGoalSavings(id, newAmount);
    setAllocatedToGoals(allocatedToGoals + addAmount);
    setEditingId(null);
    setAddAmount(0);
  };

  const handleQuickAllocate = async (goalId: string, amount: number, currentSaved: number) => {
    if (amount <= 0 || amount > liveSavings) {
      setErrorMsg(`You cannot add more than your available savings of ₹${liveSavings.toLocaleString('en-IN')}`);
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const newAmount = currentSaved + amount;
    await updateGoalSavings(goalId, newAmount);
    setAllocatedToGoals(allocatedToGoals + amount);
  };

  return (
    <section className="mb-12">

      {/* Suggestion Banner */}
      <AnimatePresence>
        {showBanner && liveSavings > 0 && goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-6 rounded-[24px] flex items-center justify-between gap-6 flex-wrap"
            style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.2)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  You have{' '}
                  <span className="text-violet-400">
                    ₹{liveSavings.toLocaleString('en-IN')}
                  </span>{' '}
                  available savings this month!
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Allocate some savings to your goals below.
                </p>
              </div>
            </div>

            {/* Quick allocate buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {goals.map(g => {
                const needed = g.target_amount - g.saved_amount;
                const suggested = Math.min(
                  Math.floor(liveSavings / goals.length),
                  needed
                );
                if (suggested <= 0 || g.progress >= 100) return null;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleQuickAllocate(g.id, suggested, g.saved_amount)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-violet-500/20"
                    style={{
                      background: 'rgba(139,92,246,0.12)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      color: '#a78bfa'
                    }}
                  >
                    +₹{suggested.toLocaleString('en-IN')} → {g.name}
                  </button>
                );
              })}
              <button
                onClick={() => setShowBanner(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Popup */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="mb-6 p-4 rounded-2xl flex items-center justify-between gap-4"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)'
            }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <p className="text-sm font-medium text-rose-400">{errorMsg}</p>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="p-1.5 rounded-xl hover:bg-rose-500/10 transition-colors text-rose-400"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-400" />
          Savings Goals
          {liveSavings > 0 && (
            <span
              className="text-xs font-medium px-2 py-1 rounded-full ml-1"
              style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}
            >
              ₹{liveSavings.toLocaleString('en-IN')} available
            </span>
          )}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-4 h-4 text-slate-300" />
          Add New Goal
        </button>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 rounded-[24px] mb-8"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                className="rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Goal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                className="rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Target amount (₹)"
                value={target || ''}
                onChange={(e) => setTarget(parseFloat(e.target.value))}
              />
              <input
                type="number"
                className="rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-primary)'
                }}
                placeholder="Initial saved (₹)"
                value={saved || ''}
                onChange={(e) => setSaved(parseFloat(e.target.value))}
              />
              <input
                type="date"
                className="rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-primary)'
                }}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-2xl font-bold transition-all"
                style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all"
              >
                Save Goal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {goals.length === 0 ? (
        <div
          className="glass-card p-8 rounded-[24px] text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="text-violet-400 w-6 h-6" />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            No goals yet. Create your first savings goal!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g, i) => {
            const overdue = (daysRemaining(g.deadline) ?? 0) < 0 && g.progress < 100;
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group glass-card p-6 rounded-[24px] relative overflow-hidden flex flex-col min-w-[280px]"
                style={{
                  background: 'var(--bg-card)',
                  border: g.progress >= 100
                    ? '1px solid rgba(16,185,129,0.3)'
                    : '1px solid var(--border-card)',
                  boxShadow: g.progress >= 100
                    ? '0 0 20px rgba(16,185,129,0.15)'
                    : undefined
                }}
              >
                {/* Completed glow */}
                {g.progress >= 100 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                  </motion.div>
                )}

                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--bg-card)' }}
                    >
                      <Target className="w-4 h-4 text-violet-400" />
                    </div>
                    <h4 className="font-bold text-sm">{g.name}</h4>
                  </div>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amounts */}
                <div className="flex flex-col gap-3 mb-4">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Target</p>
                    <p className="text-lg font-mono font-bold">
                      ₹{g.target_amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Saved</p>
                    <p className="text-lg font-mono font-bold">
                      ₹{g.saved_amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  className="w-full rounded-full h-4 overflow-hidden mb-2"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)'
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, g.progress)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`${progressColor(g.progress, overdue)} h-full`}
                  />
                </div>

                {/* Progress Info */}
                <div
                  className="flex items-center justify-between text-xs mb-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span>Progress: {g.progress}%</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {g.deadline ? g.deadline : 'No deadline'}
                  </span>
                </div>

                {/* Days remaining */}
                <p
                  className="text-[11px] mb-4"
                  style={{ color: overdue ? '#f87171' : 'var(--text-secondary)' }}
                >
                  {g.deadline ? (() => {
                    const days = daysRemaining(g.deadline);
                    if (days === null) return '';
                    if (days < 0) return `⚠️ Overdue by ${Math.abs(days)} day(s)`;
                    if (days === 0) return '🔔 Due today';
                    return `${days} day(s) remaining`;
                  })() : ''}
                </p>

                {/* Add Money */}
                <AnimatePresence>
                  {editingId === g.id ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      {liveSavings > 0 && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Available:{' '}
                          <span className="text-violet-400 font-bold">
                            ₹{liveSavings.toLocaleString('en-IN')}
                          </span>
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="flex-grow rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                          style={{
                            background: 'var(--bg-input)',
                            border: addAmount > liveSavings && addAmount > 0
                              ? '1px solid #f43f5e'
                              : '1px solid var(--border-input)',
                            color: 'var(--text-primary)'
                          }}
                          placeholder="Amount to add"
                          value={addAmount || ''}
                          max={liveSavings}
                          onChange={(e) => setAddAmount(parseFloat(e.target.value))}
                        />
                        <button
                          onClick={() => handleAddMoney(g.id, g.saved_amount)}
                          className="px-4 py-2 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setAddAmount(0);
                            setErrorMsg(null);
                          }}
                          className="px-3 py-2 rounded-2xl font-bold transition-all"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(g.id); setErrorMsg(null); }}
                      disabled={g.progress >= 100}
                      className="w-full py-2 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-card)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <PiggyBank className="w-4 h-4 text-violet-400" />
                      {g.progress >= 100 ? '🎉 Goal Completed!' : 'Add Money'}
                    </button>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}