import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Budget } from '../types';
import { API_URL } from '../constants';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  getMonthlySummary: (month: string) => {
    income: number;
    expenses: number;
    remainingBudget: number;
    budgetAmount: number;
    netBalance: number;
  };
  loadDemoData: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  useEffect(() => {
    if (!token) return;
    fetchExpenses();
    fetchIncome();
    fetchBudgets();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_URL}/expenses`, { headers: getHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      const expenses: Transaction[] = data.map((e: any) => ({
        id: String(e.id),
        amount: e.amount,
        type: 'expense',
        category: e.category,
        date: e.date ? new Date(e.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: e.title
      }));
      setTransactions(prev => [...prev.filter(t => t.type === 'income'), ...expenses]);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const fetchIncome = async () => {
    try {
      const res = await fetch(`${API_URL}/income`, { headers: getHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      const incomes: Transaction[] = data.map((i: any) => ({
        id: String(i.id),
        amount: i.amount,
        type: 'income',
        category: i.source || 'Salary',
        date: i.date ? new Date(i.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: i.title
      }));
      setTransactions(prev => [...prev.filter(t => t.type === 'expense'), ...incomes]);
    } catch (err) {
      console.error('Error fetching income:', err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`${API_URL}/budget`, { headers: getHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      const mapped: Budget[] = data.map((b: any) => ({
        month: b.month,
        amount: b.limit_amount
      }));
      setBudgets(mapped);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    }
  };

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    try {
      if (t.type === 'expense') {
        await fetch(`${API_URL}/expenses`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ title: t.description, amount: t.amount, category: t.category, note: '' })
        });
        await fetchExpenses();
      } else {
        await fetch(`${API_URL}/income`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ title: t.description, amount: t.amount, source: t.category })
        });
        await fetchIncome();
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) return;
      if (transaction.type === 'expense') {
        await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE', headers: getHeaders() });
        await fetchExpenses();
      } else {
        await fetch(`${API_URL}/income/${id}`, { method: 'DELETE', headers: getHeaders() });
        await fetchIncome();
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const addBudget = async (b: Budget) => {
    try {
      await fetch(`${API_URL}/budget`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ category: 'General', limit_amount: b.amount, month: b.month })
      });
      await fetchBudgets();
    } catch (err) {
      console.error('Error adding budget:', err);
    }
  };

  const getMonthlySummary = (month: string) => {
    const monthlyTransactions = transactions.filter(t => t.date.startsWith(month));
    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const budget = budgets.find(b => b.month === month);
    const budgetAmount = budget?.amount || 0;
    const remainingBudget = budgetAmount - expenses;
    const netBalance = income - expenses;
    return { income, expenses, remainingBudget, budgetAmount, netBalance };
  };

  const loadDemoData = () => {};

  return (
    <ExpenseContext.Provider value={{
      transactions, budgets, addTransaction, deleteTransaction, addBudget, getMonthlySummary, loadDemoData
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}