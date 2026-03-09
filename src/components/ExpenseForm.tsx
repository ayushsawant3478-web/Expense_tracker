import { useState, FormEvent, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, API_URL } from '../constants';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

export default function ExpenseForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { addTransaction } = useExpense();
  const [autoDetected, setAutoDetected] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [descTimer, setDescTimer] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (descTimer) {
      clearTimeout(descTimer);
    }
    if (description.trim().length < 3) {
      setAutoDetected(false);
      return;
    }
    const t = window.setTimeout(async () => {
      try {
        setDetecting(true);
        const res = await fetch(`${API_URL}/expenses/categorize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description })
        });
        if (res.ok) {
          const data = await res.json();
          setCategory(data.category);
          setAutoDetected(true);
        }
      } catch (_) {
      } finally {
        setDetecting(false);
      }
    }, 500);
    setDescTimer(t);
    return () => clearTimeout(t);
  }, [description]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    addTransaction({
      description,
      amount,
      type: 'expense',
      category,
      date,
    });
    setDescription('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          placeholder="e.g. Groceries"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Amount (₹)</label>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            min="0.01"
            step="0.01"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-mono"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Category</label>
          <div className="relative">
            <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setAutoDetected(false); }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
            ))}
            </select>
            {detecting && (
              <RefreshCw className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
            )}
          </div>
          {autoDetected && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block mt-2 px-2 py-1 text-[11px] font-bold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20"
            >
              ✨ Auto
            </motion.span>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
      </div>
      <button
        type="submit"
        className="w-full py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-500 transition-all shadow-xl shadow-rose-500/10"
      >
        Add Expense
      </button>
    </form>
  );
}
