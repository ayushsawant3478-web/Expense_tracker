import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Activity, Receipt, TrendingDown, TrendingUp,
  ChevronDown, ChevronRight, Search, X, Shield,
  AlertTriangle, Lock, Trash2, Eye, Wifi, KeyRound
} from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AdminLog {
  id: number;
  user_id: number;
  action: string;
  timestamp: string;
  name: string;
  email: string;
}

interface AdminExpense {
  id: number;
  user_id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  name: string;
  email: string;
}

interface AdminIncome {
  id: number;
  user_id: number;
  title: string;
  amount: number;
  source: string;
  date: string;
  name: string;
  email: string;
}

interface UserSummary {
  user_id: number;
  name: string;
  email: string;
  role: string;
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  expenseCount: number;
  expenses: AdminExpense[];
  incomes: AdminIncome[];
  topCategory: string;
}

interface SecurityData {
  total_failed_logins: number;
  recent_suspicious_count_24h: number;
  deletion_count_24h: number;
  active_users_24h: number;
  active_users_list: { id: number; name: string; email: string; action_count: number; last_activity: string | null }[];
  failed_logins_by_email: { email: string; attempts: number; last_attempt: string | null }[];
  suspicious_events: { id: number; event_type: string; detail: string; severity: string; email: string | null; created_at: string | null }[];
  locked_accounts: { id: number; name: string; email: string; locked_until: string | null }[];
  excessive_deleters: { id: number; name: string; email: string; deletion_count: number }[];
  sessions: {
    total: number;
    active: number;
    active_list: { id: number; user_id: number; name: string; email: string; ip_address: string | null; login_at: string | null; last_activity: string | null; is_active: boolean }[];
    recent: { id: number; name: string; email: string; ip_address: string | null; login_at: string | null; logout_at: string | null; is_active: boolean }[];
  };
  password_changes: { name: string; email: string; changed_at: string | null; method: string }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-500/20 text-orange-400',
  Travel: 'bg-blue-500/20 text-blue-400',
  Bills: 'bg-yellow-500/20 text-yellow-400',
  Shopping: 'bg-pink-500/20 text-pink-400',
  Entertainment: 'bg-purple-500/20 text-purple-400',
  Health: 'bg-emerald-500/20 text-emerald-400',
  Education: 'bg-cyan-500/20 text-cyan-400',
  Other: 'bg-slate-500/20 text-slate-400',
};

const SEVERITY_STYLES: Record<string, string> = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  critical: 'bg-red-600/20 text-red-300 border-red-500/40',
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [expenses, setExpenses] = useState<AdminExpense[]>([]);
  const [incomes, setIncomes] = useState<AdminIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'userwise' | 'users' | 'logs' | 'security'>('userwise');
  const [security, setSecurity] = useState<SecurityData | null>(null);

  // Fetch all admin data (called on mount and for refreshes)
  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, logsRes, expensesRes, incomesRes, securityRes] = await Promise.all([
        fetch(`${API_URL}/admin/users`, { headers }),
        fetch(`${API_URL}/admin/logs`, { headers }),
        fetch(`${API_URL}/admin/expenses`, { headers }),
        fetch(`${API_URL}/admin/income`, { headers }),
        fetch(`${API_URL}/admin/security`, { headers }),
      ]);
      if (usersRes.ok) setUsers(await usersRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
      if (expensesRes.ok) setExpenses(await expensesRes.json());
      if (incomesRes.ok) setIncomes(await incomesRes.json());
      if (securityRes.ok) setSecurity(await securityRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch security data only (used for polling)
  const fetchSecurityData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const securityRes = await fetch(`${API_URL}/admin/security`, { headers });
      if (securityRes.ok) setSecurity(await securityRes.json());
    } catch (err) {
      console.error('Failed to refresh security data:', err);
    }
  };

  useEffect(() => {
    if (token) fetchAllData();
  }, [token]);

  // Auto-refresh security data every 30 seconds when on the security tab
  useEffect(() => {
    if (activeTab !== 'security' || !token) return;
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, [activeTab, token]);

  // Build user-wise summary
  const userSummaries = useMemo<UserSummary[]>(() => {
    return users.map((u) => {
      const userExpenses = expenses.filter(e => e.user_id === u.id);
      const userIncomes = incomes.filter(i => i.user_id === u.id);
      const totalExpenses = userExpenses.reduce((s, e) => s + e.amount, 0);
      const totalIncome = userIncomes.reduce((s, i) => s + i.amount, 0);

      const catTotals = userExpenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>);
      const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

      return {
        user_id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        totalExpenses,
        totalIncome,
        netBalance: totalIncome - totalExpenses,
        expenseCount: userExpenses.length,
        expenses: userExpenses,
        incomes: userIncomes,
        topCategory,
      };
    });
  }, [users, expenses, incomes]);

  const allCategories = useMemo(() => {
    const cats = new Set(expenses.map(e => e.category));
    return ['All', ...Array.from(cats).sort()];
  }, [expenses]);

  const filteredSummaries = useMemo(() => {
    return userSummaries.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'All' ||
        u.expenses.some(e => e.category === categoryFilter);
      return matchSearch && matchCat;
    });
  }, [userSummaries, searchQuery, categoryFilter]);

  // Overall stats
  const totalExpenseAmount = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncomeAmount = incomes.reduce((s, i) => s + i.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Loading admin data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">Restricted — admin access only</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: users.length, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
              { label: 'Total Expenses', value: expenses.length, icon: Receipt, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
              { label: 'Expense Volume', value: `₹${totalExpenseAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
              { label: 'Income Volume', value: `₹${totalIncomeAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`p-5 rounded-2xl border ${s.bg}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
                </div>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
            {([
              { id: 'userwise', label: 'User-wise Expenses', icon: Receipt },
              { id: 'users', label: 'All Users', icon: Users },
              { id: 'logs', label: 'Activity Logs', icon: Activity },
              { id: 'security', label: 'Security', icon: Shield },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ───── USER-WISE EXPENSES TABLE ───── */}
          {activeTab === 'userwise' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search user by name or email…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        categoryFilter === cat
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Summary Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/60 border-b border-slate-800">
                  <div className="col-span-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</div>
                  <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Total Spent</div>
                  <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Total Income</div>
                  <div className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Net Balance</div>
                  <div className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Txns</div>
                  <div className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Details</div>
                </div>

                {filteredSummaries.length === 0 ? (
                  <div className="py-16 text-center text-slate-500">No users match your search</div>
                ) : (
                  filteredSummaries.map((u) => {
                    // apply category filter to expenses shown in expanded view
                    const filteredExpenses = categoryFilter === 'All'
                      ? u.expenses
                      : u.expenses.filter(e => e.category === categoryFilter);

                    return (
                      <div key={u.user_id} className="border-b border-slate-800 last:border-0">
                        {/* Summary Row */}
                        <div
                          className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors cursor-pointer"
                          onClick={() => setExpandedUser(expandedUser === u.user_id ? null : u.user_id)}
                        >
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-white truncate text-sm">{u.name}</p>
                                {u.role === 'admin' && (
                                  <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] font-bold rounded-full border border-violet-500/30">ADMIN</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 truncate">{u.email}</p>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center justify-end">
                            <span className="font-mono font-bold text-rose-400 text-sm">
                              ₹{u.totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center justify-end">
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              ₹{u.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center justify-end">
                            <span className={`font-mono font-bold text-sm ${u.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {u.netBalance >= 0 ? '+' : ''}₹{u.netBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="col-span-1 flex items-center justify-center">
                            <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs font-bold text-slate-300">
                              {u.expenseCount}
                            </span>
                          </div>
                          <div className="col-span-1 flex items-center justify-center">
                            <motion.div animate={{ rotate: expandedUser === u.user_id ? 90 : 0 }}>
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Expanded Expense Detail Rows */}
                        <AnimatePresence>
                          {expandedUser === u.user_id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-slate-950/60 border-t border-slate-800/60 px-6 py-4">
                                {/* Top Category chip */}
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="text-xs text-slate-500 font-medium">Top category:</span>
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[u.topCategory] || 'bg-slate-700 text-slate-300'}`}>
                                    {u.topCategory}
                                  </span>
                                  <span className="text-xs text-slate-500 ml-auto">{filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} shown</span>
                                </div>

                                {filteredExpenses.length === 0 ? (
                                  <p className="text-slate-500 text-sm py-4 text-center">No expenses in this category</p>
                                ) : (
                                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                    {/* Sub-table header */}
                                    <div className="grid grid-cols-12 gap-3 px-3 py-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                                      <div className="col-span-4">Title</div>
                                      <div className="col-span-2">Category</div>
                                      <div className="col-span-3">Date</div>
                                      <div className="col-span-3 text-right">Amount</div>
                                    </div>
                                    {filteredExpenses
                                      .slice()
                                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                      .map(exp => (
                                        <div key={exp.id} className="grid grid-cols-12 gap-3 items-center px-3 py-2.5 bg-slate-900/60 rounded-xl border border-slate-800/40 hover:border-slate-700/60 transition-colors">
                                          <div className="col-span-4 text-sm font-medium text-white truncate">{exp.title}</div>
                                          <div className="col-span-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${CATEGORY_COLORS[exp.category] || 'bg-slate-700 text-slate-300'}`}>
                                              {exp.category}
                                            </span>
                                          </div>
                                          <div className="col-span-3 text-xs text-slate-500">
                                            {new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                          </div>
                                          <div className="col-span-3 text-right font-mono font-bold text-rose-400 text-sm">
                                            -₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                )}

                                {/* User totals footer */}
                                <div className="mt-4 pt-4 border-t border-slate-800/60 flex justify-end gap-6 text-sm">
                                  <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-0.5">Total Spent</p>
                                    <p className="font-mono font-black text-rose-400">₹{u.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-0.5">Total Income</p>
                                    <p className="font-mono font-black text-emerald-400">₹{u.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-0.5">Net Balance</p>
                                    <p className={`font-mono font-black ${u.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {u.netBalance >= 0 ? '+' : ''}₹{u.netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* ───── ALL USERS TABLE ───── */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/60">
                      <tr>
                        {['Name', 'Email', 'Role', 'Joined'].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                          <td className="px-6 py-4 text-slate-400 text-sm">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-sm">{new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── ACTIVITY LOGS ───── */}
          {activeTab === 'logs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-h-[600px] overflow-y-auto">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-4 px-6 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{log.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{log.name} · {log.email}</p>
                    </div>
                    <div className="text-xs text-slate-600 whitespace-nowrap flex-shrink-0">
                      {new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ───── SECURITY DASHBOARD ───── */}
          {activeTab === 'security' && security && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Security Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Failed Logins', value: security.total_failed_logins, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  { label: 'Active Users (24h)', value: security.active_users_24h, icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Suspicious (24h)', value: security.recent_suspicious_count_24h, icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                  { label: 'Deletions (24h)', value: security.deletion_count_24h, icon: Trash2, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                  { label: 'Locked Accounts', value: security.locked_accounts.length, icon: Lock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  { label: 'Active Sessions', value: security.sessions.active, icon: Wifi, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-2xl border ${s.bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
                    </div>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Locked Accounts */}
              {security.locked_accounts.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Currently Locked Accounts
                  </h3>
                  <div className="space-y-2">
                    {security.locked_accounts.map(a => (
                      <div key={a.id} className="flex items-center justify-between px-4 py-3 bg-slate-900/60 rounded-xl border border-slate-800/50">
                        <div>
                          <p className="text-sm font-semibold text-white">{a.name}</p>
                          <p className="text-xs text-slate-500">{a.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-amber-400 font-bold">Locked until</p>
                          <p className="text-xs text-slate-400">{a.locked_until ? new Date(a.locked_until).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed Logins by Email */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="font-bold text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Failed Login Attempts by Email</h3>
                </div>
                {security.failed_logins_by_email.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-sm">No failed logins recorded</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Attempts</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Last Attempt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {security.failed_logins_by_email.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="px-6 py-3 text-sm text-white font-medium">{r.email}</td>
                            <td className="px-6 py-3 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.attempts >= 5 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{r.attempts}</span>
                            </td>
                            <td className="px-6 py-3 text-right text-xs text-slate-500">{r.last_attempt ? new Date(r.last_attempt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Suspicious Events */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="font-bold text-white flex items-center gap-2"><Shield className="w-4 h-4 text-red-400" /> Suspicious Activity Log</h3>
                </div>
                {security.suspicious_events.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-sm">No suspicious activity detected — all clear</div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {security.suspicious_events.map(evt => (
                      <div key={evt.id} className="flex items-start gap-4 px-6 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/20 transition-colors">
                        <div className="mt-1 flex-shrink-0">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${SEVERITY_STYLES[evt.severity] || SEVERITY_STYLES['medium']}`}>{evt.severity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white">{evt.event_type.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{evt.detail}</p>
                          {evt.email && <p className="text-[11px] text-slate-600 mt-0.5">{evt.email}</p>}
                        </div>
                        <div className="text-xs text-slate-600 whitespace-nowrap flex-shrink-0">
                          {evt.created_at ? new Date(evt.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Most Active Users (24h) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="font-bold text-white flex items-center gap-2"><Eye className="w-4 h-4 text-emerald-400" /> Most Active Users (24h)</h3>
                </div>
                {security.active_users_list.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-sm">No activity in the last 24 hours</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Actions</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Last Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {security.active_users_list.map(u => (
                          <tr key={u.id} className="hover:bg-slate-800/30">
                            <td className="px-6 py-3">
                              <p className="text-sm font-semibold text-white">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">{u.action_count}</span>
                            </td>
                            <td className="px-6 py-3 text-right text-xs text-slate-500">{u.last_activity ? new Date(u.last_activity).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Excessive Deleters — live 1-hour window + historical from suspicious_events */}
              {(() => {
                // Merge live excessive deleters with historical EXCESSIVE_DELETIONS events from suspicious_events
                const liveDeleters = security.excessive_deleters;
                const historicalDeletionEvents = security.suspicious_events.filter(
                  evt => evt.event_type === 'EXCESSIVE_DELETIONS'
                );
                const hasAlerts = liveDeleters.length > 0 || historicalDeletionEvents.length > 0;
                if (!hasAlerts) return null;
                return (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Excessive Deletions Alert
                    </h3>
                    <div className="space-y-2">
                      {/* Live: users currently exceeding threshold */}
                      {liveDeleters.map(d => (
                        <div key={`live-${d.id}`} className="flex items-center justify-between px-4 py-3 bg-slate-900/60 rounded-xl border border-red-500/30">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <div>
                              <p className="text-sm font-semibold text-white">{d.name}</p>
                              <p className="text-xs text-slate-500">{d.email}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">{d.deletion_count} deletions/hr — ACTIVE</span>
                        </div>
                      ))}
                      {/* Historical: past EXCESSIVE_DELETIONS events from suspicious_events log */}
                      {historicalDeletionEvents
                        .filter(evt => !liveDeleters.some(d => d.email === evt.email))
                        .map(evt => (
                        <div key={`hist-${evt.id}`} className="flex items-center justify-between px-4 py-3 bg-slate-900/60 rounded-xl border border-slate-800/50">
                          <div>
                            <p className="text-sm font-semibold text-white">{evt.event_type.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{evt.detail}</p>
                            {evt.email && <p className="text-[11px] text-slate-600 mt-0.5">{evt.email}</p>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${SEVERITY_STYLES[evt.severity] || SEVERITY_STYLES['medium']}`}>{evt.severity}</span>
                            <p className="text-xs text-slate-600 mt-1">{evt.created_at ? new Date(evt.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Currently Active Sessions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2"><Wifi className="w-4 h-4 text-cyan-400" /> Currently Active Sessions</h3>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold">{security.sessions.active} live</span>
                </div>
                {security.sessions.active_list.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-sm">No active sessions</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase">IP Address</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Login Time</th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {security.sessions.active_list.map(s => (
                          <tr key={s.id} className="hover:bg-slate-800/30">
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <div>
                                  <p className="text-sm font-semibold text-white">{s.name}</p>
                                  <p className="text-xs text-slate-500">{s.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs font-mono text-slate-300">{s.ip_address || '—'}</span>
                            </td>
                            <td className="px-6 py-3 text-center text-xs text-slate-500">{s.login_at ? new Date(s.login_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                            <td className="px-6 py-3 text-right text-xs text-slate-500">{s.last_activity ? new Date(s.last_activity).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Session History */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="font-bold text-white flex items-center gap-2"><Activity className="w-4 h-4 text-violet-400" /> Recent Session History (24h)</h3>
                </div>
                {security.sessions.recent.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-sm">No sessions in the last 24 hours</div>
                ) : (
                  <div className="max-h-[350px] overflow-y-auto">
                    {security.sessions.recent.map(s => (
                      <div key={s.id} className="flex items-center gap-4 px-6 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800/20 transition-colors">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{s.name} <span className="text-slate-500 text-xs">({s.email})</span></p>
                          <p className="text-[11px] text-slate-600 font-mono">{s.ip_address || 'unknown IP'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-slate-500">In: {s.login_at ? new Date(s.login_at).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                          <p className="text-xs text-slate-600">Out: {s.logout_at ? new Date(s.logout_at).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' }) : <span className="text-emerald-500 font-bold">ACTIVE</span>}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Password Change Logs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="font-bold text-white flex items-center gap-2"><KeyRound className="w-4 h-4 text-amber-400" /> Password Change Log</h3>
                </div>
                {security.password_changes.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-sm">No password changes recorded</div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    {security.password_changes.map((p, i) => (
                      <div key={i} className="flex items-center gap-4 px-6 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800/20 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <KeyRound className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="px-2 py-0.5 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase">{p.method}</span>
                          <p className="text-xs text-slate-600 mt-0.5">{p.changed_at ? new Date(p.changed_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}