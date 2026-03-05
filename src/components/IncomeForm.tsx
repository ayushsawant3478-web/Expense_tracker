import { useState, FormEvent } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { INCOME_SOURCES } from '../constants';

export default function IncomeForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [source, setSource] = useState(INCOME_SOURCES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { addTransaction } = useExpense();

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
        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          placeholder="e.g. Monthly Salary"
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
          <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          >
            {INCOME_SOURCES.map(src => (
              <option key={src} value={src} className="bg-slate-900">{src}</option>
            ))}
          </select>
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
        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10"
      >
        Add Income
      </button>
    </form>
  );
}
