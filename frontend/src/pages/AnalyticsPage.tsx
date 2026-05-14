import { useExpense } from '../context/ExpenseContext';
import Navbar from '../components/Navbar';
import ChartComponent from '../components/ChartComponent';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const { transactions, selectedMonth, setSelectedMonth } = useExpense();

  const monthlyTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  const totalIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const categoryTotals = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

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
    const current = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    return selectedMonth === current;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Deep dive into your financial data for{' '}
                <span className="font-semibold text-violet-400">{getMonthLabel()}</span>
              </p>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Income', value: `₹${totalIncome.toLocaleString('en-IN')}`, color: 'text-emerald-400' },
              { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, color: 'text-rose-400' },
              { label: 'Top Category', value: topCategory ? `${topCategory[0]} (₹${topCategory[1].toLocaleString('en-IN')})` : 'None', color: 'text-violet-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[24px]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
              >
                <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="p-8 rounded-[32px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
            <ChartComponent transactions={monthlyTransactions} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
