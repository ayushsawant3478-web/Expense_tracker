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
  loginWithGoogle: (userData: any, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const demoUser = { id: 'demo', username: 'Demo User', email: 'demo@trackify.com' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('trackify_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('trackify_token');
    } catch {
      return null;
    }
  });

  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('trackify_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trackify_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('trackify_token', token);
    } else {
      localStorage.removeItem('trackify_token');
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

    const username = data.user?.username || data.user?.name || email.split('@')[0];

    setUser({
      id: String(data.user.id),
      username: username,
      email: data.user.email
    });
    setToken(data.token);
    setIsDemo(false);
  };

  const loginWithGoogle = (userData: any, googleToken: string) => {
    const username = userData?.username || userData?.name || 'User';
    const newUser = {
      id: String(userData.id),
      username: username,
      email: userData.email
    };
    setUser(newUser);
    setToken(googleToken);
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

    // Auto login after register
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsDemo(false);
    localStorage.removeItem('trackify_user');
    localStorage.removeItem('trackify_token');
  };

  const activateDemo = () => {
    setIsDemo(true);
    setUser(demoUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isDemo, activateDemo, loginWithGoogle }}>
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