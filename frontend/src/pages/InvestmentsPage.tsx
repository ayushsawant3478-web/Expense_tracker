import Navbar from '../components/Navbar';
import LiveMarketData from '../components/LiveMarketData';
import { useExpense } from '../context/ExpenseContext';
import { motion } from 'motion/react';
import { useMemo } from 'react';

export default function InvestmentsPage() {
  const { getMonthlySummary } = useExpense();
  const currentMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
  const { netBalance } = getMonthlySummary(currentMonth);

  const savingsTier = useMemo((): 'none' | 'starter' | 'growing' | 'moderate' | 'good' | 'excellent' => {
    if (netBalance <= 0) return 'none';
    if (netBalance < 2000) return 'starter';
    if (netBalance < 5000) return 'growing';
    if (netBalance < 10000) return 'moderate';
    if (netBalance < 25000) return 'good';
    return 'excellent';
  }, [netBalance]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Investments</h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Live market data and personalized suggestions</p>
          <LiveMarketData savingsTier={savingsTier} />
        </motion.div>
      </main>
    </div>
  );
}