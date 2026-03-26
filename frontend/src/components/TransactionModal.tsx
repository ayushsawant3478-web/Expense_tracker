import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass-card p-8 rounded-[32px] pointer-events-auto relative overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Add Transaction</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Record your financial activity to keep your stats up to date.
                </p>
              </div>

              <div className="flex p-1.5 bg-white/5 rounded-2xl mb-8 border border-white/5">
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

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'expense' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'expense' ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'expense' ? (
                      <ExpenseForm onSuccess={onClose} />
                    ) : (
                      <IncomeForm onSuccess={onClose} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
