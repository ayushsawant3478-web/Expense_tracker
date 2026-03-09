import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGoal } from '../context/GoalContext';
import { Target, Plus, Trash2, PiggyBank, Calendar } from 'lucide-react';

export default function GoalTracker() {
  const { goals, addGoal, updateGoalSavings, deleteGoal } = useGoal();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState<number>(0);
  const [saved, setSaved] = useState<number>(0);
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState<number>(0);

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
    await addGoal({ name, target_amount: target, saved_amount: saved, deadline, progress: 0 } as any);
    setShowForm(false);
    setName('');
    setTarget(0);
    setSaved(0);
    setDeadline(new Date().toISOString().split('T')[0]);
  };

  const handleAddMoney = async (id: string, currentSaved: number) => {
    const newAmount = Math.max(0, currentSaved + addAmount);
    await updateGoalSavings(id, newAmount);
    setEditingId(null);
    setAddAmount(0);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-400" />
          Savings Goals
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <Plus className="w-4 h-4 text-slate-300" />
          Add New Goal
        </button>
      </div>

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
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                placeholder="Goal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                className="rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                placeholder="Target amount (₹)"
                value={target}
                onChange={(e) => setTarget(parseFloat(e.target.value))}
              />
              <input
                type="number"
                className="rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                placeholder="Initial saved (₹)"
                value={saved}
                onChange={(e) => setSaved(parseFloat(e.target.value))}
              />
              <input
                type="date"
                className="rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
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

      {goals.length === 0 ? (
        <div className="glass-card p-8 rounded-[24px] text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
          <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="text-violet-400 w-6 h-6" />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>No goals yet. Create your first savings goal!</p>
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
                className="group glass-card p-6 rounded-[24px] relative overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
              >
                {g.progress >= 100 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                  </motion.div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Target</p>
                    <p className="text-lg font-mono font-bold">₹{g.target_amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Saved</p>
                    <p className="text-lg font-mono font-bold">₹{g.saved_amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="w-full rounded-full h-4 overflow-hidden mb-2" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, g.progress)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`${progressColor(g.progress, overdue)} h-full`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  <span>Progress: {g.progress}%</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {g.deadline ? g.deadline : 'No deadline'}
                  </span>
                </div>
                <p className="text-[11px] mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {g.deadline ? (() => {
                    const days = daysRemaining(g.deadline);
                    if (days === null) return '';
                    if (days < 0) return `Overdue by ${Math.abs(days)} day(s)`;
                    if (days === 0) return 'Due today';
                    return `${days} day(s) remaining`;
                  })() : ''}
                </p>

                <AnimatePresence>
                  {editingId === g.id ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="number"
                        className="flex-grow rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                        placeholder="Amount to add"
                        value={addAmount}
                        onChange={(e) => setAddAmount(parseFloat(e.target.value))}
                      />
                      <button
                        onClick={() => handleAddMoney(g.id, g.saved_amount)}
                        className="px-4 py-2 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-500 transition-all"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setAddAmount(0); }}
                        className="px-3 py-2 rounded-2xl font-bold transition-all"
                        style={{ background: 'var(--bg-card)' }}
                      >
                        Cancel
                      </button>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setEditingId(g.id)}
                      className="w-full py-2 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                    >
                      <PiggyBank className="w-4 h-4 text-violet-400" />
                      Add Money
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
