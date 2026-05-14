import { useState, FormEvent, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { INCOME_SOURCES, API_URL } from '../constants';
import { motion } from 'motion/react';
import { RefreshCw, Plus } from 'lucide-react';
import Toast from './Toast';

interface Props {
  onSuccess?: () => void;
}

export default function IncomeForm({ onSuccess }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [source, setSource] = useState(INCOME_SOURCES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { addTransaction } = useExpense();
  const [autoDetected, setAutoDetected] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [descTimer, setDescTimer] = useState<number | undefined>(undefined);
  const [showToast, setShowToast] = useState(false);

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
    setShowToast(true);
    if (onSuccess) {
      setTimeout(onSuccess, 500); // Small delay before closing modal
    }
  };

  return (
    <>
      <Toast 
        show={showToast} 
        message="Income added successfully! 💰" 
        onClose={() => setShowToast(false)} 
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-50 ml-1">Description</label>
            <div className="relative group">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all group-hover:border-violet-500/30"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                placeholder="e.g. Monthly Salary"
                required
              />
              {detecting && (
                <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin opacity-40" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-50 ml-1">Amount (₹)</label>
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-50 ml-1">Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              >
                {INCOME_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-50 ml-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full apple-btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Income
        </button>
      </form>
    </>
  );
}
