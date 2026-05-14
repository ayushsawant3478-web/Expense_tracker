import { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useExpense();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const filtered = transactions
    .filter(t => filter === 'all' ? true : t.type === filter)
    .filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .slice().reverse();

  // Pagination Logic
  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalResults);
  const paginatedTransactions = filtered.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Transactions</h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>All your income and expenses in one place</p>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              />
            </div>
            <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              {(['all', 'income', 'expense'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
                  style={{
                    background: filter === f ? (f === 'income' ? '#059669' : f === 'expense' ? '#e11d48' : '#7c3aed') : 'transparent',
                    color: filter === f ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {paginatedTransactions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20" 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <p className="text-lg">No transactions found</p>
                </motion.div>
              ) : (
                paginatedTransactions.map((t) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={`${t.type}-${t.id}`}
                    className="group p-4 rounded-2xl flex items-center justify-between transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {t.type === 'income' ? <Plus className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{t.description}</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.date} • {t.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-mono font-bold text-lg ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalResults > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer p-1 rounded-lg"
                    style={{ color: 'var(--text-primary)', border: '1px solid var(--border-input)' }}
                  >
                    {[4, 8, 12].map(n => (
                      <option key={n} value={n} className="bg-slate-900">{n}</option>
                    ))}
                  </select>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {startIndex + 1}–{endIndex} of {totalResults}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((n, i) => (
                    <button
                      key={i}
                      onClick={() => typeof n === 'number' && setCurrentPage(n)}
                      disabled={typeof n !== 'number'}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        currentPage === n 
                          ? 'shadow-lg shadow-violet-500/20' 
                          : typeof n === 'number' ? 'hover:bg-white/5' : 'cursor-default opacity-50'
                      }`}
                      style={{
                        background: currentPage === n ? '#7c3aed' : 'transparent',
                        color: currentPage === n ? 'white' : 'var(--text-secondary)'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}