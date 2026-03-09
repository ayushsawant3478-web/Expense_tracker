import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Goal } from '../types';
import { API_URL } from '../constants';
import { useAuth } from './AuthContext';

interface GoalContextType {
  goals: Goal[];
  fetchGoals: () => Promise<void>;
  addGoal: (g: Omit<Goal, 'id' | 'progress'>) => Promise<void>;
  updateGoalSavings: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const mapGoal = (g: any): Goal => {
    const progress = g.target_amount > 0 ? Math.min(100, Math.round((g.saved_amount / g.target_amount) * 100)) : 0;
    return {
      id: String(g.id),
      name: g.name,
      target_amount: g.target_amount,
      saved_amount: g.saved_amount,
      deadline: g.deadline ? new Date(g.deadline).toISOString().split('T')[0] : '',
      progress
    };
  };

  const fetchGoals = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/goals`, { headers: getHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setGoals(data.map(mapGoal));
    } catch (e) {
      console.error('Error fetching goals', e);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchGoals();
  }, [token]);

  const addGoal = async (g: Omit<Goal, 'id' | 'progress'>) => {
    try {
      await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: g.name,
          target_amount: g.target_amount,
          saved_amount: g.saved_amount,
          deadline: g.deadline
        })
      });
      await fetchGoals();
    } catch (e) {
      console.error('Error adding goal', e);
    }
  };

  const updateGoalSavings = async (id: string, amount: number) => {
    try {
      await fetch(`${API_URL}/goals/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ saved_amount: amount })
      });
      await fetchGoals();
    } catch (e) {
      console.error('Error updating goal savings', e);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      await fetchGoals();
    } catch (e) {
      console.error('Error deleting goal', e);
    }
  };

  return (
    <GoalContext.Provider value={{ goals, fetchGoals, addGoal, updateGoalSavings, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoal() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
}

