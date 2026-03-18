import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { API_URL } from '../constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isDemo: boolean;
  activateDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUser = { id: 'demo', username: 'Demo User', email: 'demo@vittvantage.com' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vittvantage_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vittvantage_token');
  });

  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vittvantage_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vittvantage_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vittvantage_token', token);
    } else {
      localStorage.removeItem('vittvantage_token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setUser({ id: data.user.id, username: data.user.name, email: data.user.email });
    setToken(data.token);
    setIsDemo(false);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Register failed');
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsDemo(false);
  };

  const activateDemo = () => {
    setIsDemo(true);
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isDemo, activateDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}