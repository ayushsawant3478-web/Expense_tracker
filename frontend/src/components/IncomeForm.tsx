import { useState, FormEvent, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { INCOME_SOURCES, API_URL } from '../constants';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

export default function IncomeForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [source, setSource] = useState(INCOME_SOURCES[0]);
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
        const res = await fetch(`${API_URL}/income/categorize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description })
        });
        if (res.ok) {
          const data = await res.json();
          setSource(data.source);
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
      type: 'income',
      category: source,
      date,
    });
    setDescription('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all apple-input"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
          placeholder="e.g. Monthly Salary"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Amount (₹)</label>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            min="0.01"
            step="0.01"
            className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-mono apple-input"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Source</label>
          <div className="relative">
            <select
            value={source}
            onChange={(e) => { setSource(e.target.value); setAutoDetected(false); }}
            className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all apple-input"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
          >
            {INCOME_SOURCES.map(src => (
              <option key={src} value={src} className="bg-slate-900">{src}</option>
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
        <label className="block text-sm font-medium mb-1.5 ml-1" style={{ color: 'var(--text-secondary)' }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all apple-input"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
        />
      </div>
      <button
        type="submit"
        className="w-full apple-btn-primary"
      >
        Add Income
      </button>
    </form>
  );
}
