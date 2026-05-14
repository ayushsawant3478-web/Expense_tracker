import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';

export default function AddTransactionPage() {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium mb-6 hover:text-violet-500 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Add Transaction
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Record your income or expenses to keep your finances on track.
          </p>
        </motion.div>

        <section className="glass-card p-8 rounded-[32px] relative overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', perspective: '1200px' }}>
          <div className="flex p-1.5 bg-white/5 rounded-2xl mb-8 relative z-10 border border-white/5">
            <button
              onClick={() => setActiveTab('expense')}
              className={`flex-grow py-3 rounded-xl text-sm font-extrabold transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === 'expense' ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <TrendingDown className="w-4 h-4" />
              Expense
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`flex-grow py-3 rounded-xl text-sm font-extrabold transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === 'income' ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <TrendingUp className="w-4 h-4" />
              Income
            </button>
          </div>

          <div className="relative" style={{ minHeight: '400px' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ rotateY: activeTab === 'expense' ? -90 : 90, opacity: 0, scale: 0.9 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: activeTab === 'expense' ? 90 : -90, opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  mass: 1,
                  duration: 0.6 
                }}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transformStyle: 'preserve-3d',
                  width: '100%'
                }}
              >
                <div className="p-2">
                  {activeTab === 'expense' ? <ExpenseForm /> : <IncomeForm />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
